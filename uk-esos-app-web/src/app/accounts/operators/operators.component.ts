import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, first, map, Observable, ReplaySubject, shareReplay, switchMap, takeUntil, tap } from 'rxjs';

import { accountFinalStatuses } from '@accounts/core/accountFinalStatuses';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { AuthStore, selectUserId, selectUserRoleType } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';

import { GovukSelectOption, GovukTableColumn, GovukValidators } from 'govuk-components';

import {
  AccountOperatorAuthorityUpdateDTO,
  AuthoritiesService,
  OperatorAuthoritiesService,
  OrganisationAccountDTO,
  UserAuthorityInfoDTO,
} from 'esos-api';

import { savePartiallyNotFoundOperatorError } from './errors/business-error';

@Component({
  selector: 'esos-operators',
  templateUrl: './operators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class OperatorsComponent implements OnInit {
  @Input() currentTab: string;

  private accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));

  isAccountEditable$: Observable<boolean>;

  accountAuthorities$: Observable<UserAuthorityInfoDTO[]>;
  contactType$: Observable<{ [key: string]: string }>;
  isEditable$: Observable<boolean>;
  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  addUserForm: UntypedFormGroup = this.fb.group({ userType: ['operator'] });
  editableCols: GovukTableColumn[] = [
    { field: 'name', header: 'Name', isSortable: true },
    { field: 'roleName', header: 'User type' },
    { field: 'PRIMARY', header: 'Primary contact' },
    { field: 'SECONDARY', header: 'Secondary contact' },
    { field: 'authorityStatus', header: 'Account status' },
    { field: 'deleteBtn', header: undefined },
  ];
  nonEditableCols = this.editableCols.slice(0, 4);
  userTypes: GovukSelectOption<string>[] = [
    { text: 'Advanced user', value: 'operator_admin' },
    { text: 'Restricted user', value: 'operator' },
  ];
  authorityStatuses: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Disabled', value: 'DISABLED' },
  ];
  authorityStatusesAccepted: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
    { text: 'Accepted', value: 'ACCEPTED' },
    { text: 'Active', value: 'ACTIVE' },
  ];
  userType$: Observable<GovukSelectOption<string>[]>;
  private validators = [
    this.activeOperatorAdminValidator('You must have an advanced user on your account'),
    this.activeContactValidator('PRIMARY'),
    this.primarySecondaryValidator(
      'You cannot assign the same user as a primary and secondary contact on your account',
    ),
    this.restrictedUserContactValidator('PRIMARY'),
    this.restrictedUserContactValidator('SECONDARY'),
  ];
  usersForm = this.fb.group(
    {
      usersArray: this.fb.array([]),
      contactTypes: this.fb.group(
        {
          PRIMARY: [null, GovukValidators.required('You must have a primary contact on your account')],
          SECONDARY: [],
        },
        { updateOn: 'change' },
      ),
    },
    { validators: this.validators },
  );
  roleType$ = this.authStore.pipe(selectUserRoleType, takeUntil(this.destroy$), shareReplay());
  userId$ = this.authStore.pipe(selectUserId, takeUntil(this.destroy$));
  refresh$ = new ReplaySubject<void>(1);

  constructor(
    private readonly fb: UntypedFormBuilder,
    readonly authStore: AuthStore,
    private readonly authoritiesService: AuthoritiesService,
    private readonly operatorAuthoritiesService: OperatorAuthoritiesService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly router: Router,
    private readonly destroy$: DestroySubject,
    private readonly route: ActivatedRoute,
  ) {}

  get usersArray(): UntypedFormArray {
    return this.usersForm.get('usersArray') as UntypedFormArray;
  }

  get contactTypes(): UntypedFormGroup {
    return this.usersForm.get('contactTypes') as UntypedFormGroup;
  }

  ngOnInit(): void {
    this.isAccountEditable$ = this.route.data.pipe(
      map((data?: { account?: OrganisationAccountDTO }) => {
        return accountFinalStatuses(data?.account?.status);
      }),
    );

    this.refresh$.next();
    const operatorsManagement$ = this.refresh$.pipe(
      switchMap(() => this.accountId$),
      switchMap((accountId) => this.operatorAuthoritiesService.getAccountOperatorAuthorities(accountId)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.accountAuthorities$ = operatorsManagement$.pipe(map((operators) => operators.authorities));
    this.contactType$ = operatorsManagement$.pipe(map((operators) => operators.contactTypes));
    this.isEditable$ = operatorsManagement$.pipe(map((operators) => operators.editable));
    this.userType$ = this.accountId$.pipe(
      switchMap((accountId) => this.authoritiesService.getOperatorRoleCodes(accountId)),
      map((res) => res.map((role) => ({ text: role.name, value: role.code }))),
    );
    this.contactType$.pipe(takeUntil(this.destroy$)).subscribe((contactTypes) =>
      this.contactTypes.patchValue({
        PRIMARY: contactTypes.PRIMARY,
        SECONDARY: contactTypes.SECONDARY,
      }),
    );
  }

  addUser(userType: string): void {
    this.router.navigate([`users/add`, userType], { relativeTo: this.route });
  }

  saveUsers(): void {
    if (!this.usersForm.dirty) {
      return;
    }
    if (!this.usersForm.valid) {
      this.usersForm.markAllAsTouched();
      this.isSummaryDisplayed$.next(true);
    } else {
      this.accountId$
        .pipe(
          first(),
          switchMap((accountId) =>
            this.operatorAuthoritiesService.updateAccountOperatorAuthorities(accountId, {
              accountOperatorAuthorityUpdateList: this.usersArray.controls
                .filter((users) => users.dirty)
                .map((user) => ({
                  userId: user.value.userId,
                  roleCode: user.value.roleCode,
                  authorityStatus: user.value.authorityStatus,
                })),
              contactTypes: this.contactTypes.value,
            }),
          ),
          tap(() => this.usersForm.markAsPristine()),
          catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
            this.accountId$.pipe(
              switchMap((accountId) =>
                this.businessErrorService.showError(savePartiallyNotFoundOperatorError(accountId)),
              ),
            ),
          ),
        )
        .subscribe(() => this.refresh$.next());
    }
  }

  private activeOperatorAdminValidator(message: string): ValidatorFn {
    return GovukValidators.builder(message, (group: UntypedFormGroup) =>
      (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
        (item) => item?.roleCode === 'operator_admin' && item.authorityStatus === 'ACTIVE',
      )
        ? null
        : { noActiveOperatorAdmin: true },
    );
  }

  private activeContactValidator(contactType: string): ValidatorFn {
    return GovukValidators.builder(
      `You must have a ${contactType.toLowerCase()} contact on your account`,
      (group: UntypedFormGroup) =>
        (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
          (item) =>
            item.authorityStatus !== 'ACTIVE' && item.userId === group.get('contactTypes').get(contactType).value,
        )
          ? { [`${contactType.toLowerCase()}NotActive`]: true }
          : null,
    );
  }

  private primarySecondaryValidator(message: string): ValidatorFn {
    return GovukValidators.builder(message, (group: UntypedFormGroup) =>
      group.get('contactTypes').get('PRIMARY').value === group.get('contactTypes').get('SECONDARY').value
        ? { samePrimarySecondary: true }
        : null,
    );
  }

  private restrictedUserContactValidator(contactType: string): ValidatorFn {
    return GovukValidators.builder(
      `You cannot assign a Restricted user as ${contactType.toLowerCase()} contact on your account`,
      (group: UntypedFormGroup) =>
        (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
          (item) => item?.roleCode === 'operator' && item.userId === group.get('contactTypes').get(contactType).value,
        )
          ? { [`${contactType.toLowerCase()}RestrictedUser`]: true }
          : null,
    );
  }
}
