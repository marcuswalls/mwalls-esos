import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { BehaviorSubject, combineLatest, map, Observable, of, shareReplay, switchMap, take, tap } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { PendingRequest } from '@core/interfaces/pending-request.interface';
import { AuthStore, selectUserState } from '@core/store';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchNotFoundRequest, ErrorCode } from '@error/not-found-error';
import { requestTaskReassignedError, taskNotFoundError } from '@shared/errors/request-task-error';
import { templateError } from '@shared/errors/template-error';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';

import { GovukSelectOption } from 'govuk-components';

import {
  CaExternalContactDTO,
  CaExternalContactsService,
  OperatorAuthoritiesService,
  RequestTaskActionPayload,
  RequestTaskActionProcessDTO,
  TasksAssignmentService,
  TasksService,
} from 'esos-api';

import {
  catchBadRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes as BusinessErrorCode,
} from '../../../error/business-errors';
import {
  NotifyAccountOperatorUsersInfo,
  toAccountOperatorUser,
  toNotifyAccountOperatorUsersInfo,
} from './notify-operator';
import { NOTIFY_OPERATOR_FORM, notifyOperatorFormFactory } from './notify-operator-form.provider';

@Component({
  selector: 'esos-notify-operator',
  templateUrl: './notify-operator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [notifyOperatorFormFactory, UserFullNamePipe],
})
export class NotifyOperatorComponent implements PendingRequest, OnInit {
  @Input() taskId: number;
  @Input() accountId: number;
  @Input() requestTaskActionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  @Input() pendingRfi: boolean;
  @Input() pendingRde: boolean;
  @Input() confirmationMessage: string;
  @Input() confirmationText: string;
  @Input() referenceCode: string;
  @Input() isRegistryToBeNotified = false;
  @Input() decisionType: string;
  @Input() issueNoticeOfIntent?: boolean;
  @Input() hasSignature? = true;
  @Input() serviceContactNotAutomaticallyNotified = false;

  readonly isTemplateGenerationErrorDisplayed$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string>(null);
  isFormSubmitted$ = new BehaviorSubject(false);
  isSummaryDisplayed = new BehaviorSubject<boolean>(false);
  objectKeys = Object.keys;

  accountPrimaryContactUsersInfo$: Observable<NotifyAccountOperatorUsersInfo>;
  otherOperatorUsersInfo$: Observable<NotifyAccountOperatorUsersInfo>;
  contacts$: Observable<Array<CaExternalContactDTO>>;
  assignees$: Observable<GovukSelectOption<string>[]>;

  constructor(
    @Inject(NOTIFY_OPERATOR_FORM) readonly form: UntypedFormGroup,
    private readonly operatorAuthoritiesService: OperatorAuthoritiesService,
    private readonly externalContactsService: CaExternalContactsService,
    private readonly tasksAssignmentService: TasksAssignmentService,
    private readonly tasksService: TasksService,
    private readonly fullNamePipe: UserFullNamePipe,
    private readonly businessErrorService: BusinessErrorService,
    readonly pendingRequest: PendingRequestService,
    private readonly authStore: AuthStore,
  ) {}

  ngOnInit(): void {
    const accountOperatorAuthorities$ = this.operatorAuthoritiesService
      .getAccountOperatorAuthorities(this.accountId)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));

    const users$ = combineLatest([
      accountOperatorAuthorities$.pipe(map((accountOperator) => accountOperator.authorities)),
      accountOperatorAuthorities$.pipe(map((accountOperator) => accountOperator.contactTypes)),
    ]).pipe(
      map(([authorities, contactTypes]) =>
        authorities
          .filter((authority) => authority.authorityStatus === 'ACTIVE')
          .map((authority) => toAccountOperatorUser(authority, contactTypes)),
      ),
    );

    this.accountPrimaryContactUsersInfo$ = users$.pipe(
      map((users) =>
        users
          .filter(
            (user) =>
              user.contactTypes.includes('PRIMARY') ||
              (user.contactTypes.includes('SERVICE') && !this.serviceContactNotAutomaticallyNotified),
          )
          .reduce(toNotifyAccountOperatorUsersInfo, {}),
      ),
    );

    this.otherOperatorUsersInfo$ = users$.pipe(
      map((users) =>
        users
          .filter((user) =>
            this.serviceContactNotAutomaticallyNotified
              ? !user.contactTypes.includes('PRIMARY')
              : !user.contactTypes.includes('PRIMARY') && !user.contactTypes.includes('SERVICE'),
          )
          .reduce(toNotifyAccountOperatorUsersInfo, {}),
      ),
    );

    this.contacts$ = this.externalContactsService.getCaExternalContacts().pipe(
      map((contacts) => contacts.caExternalContacts),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.assignees$ = of(this.taskId).pipe(
      switchMap((id: number) => this.tasksAssignmentService.getCandidateAssigneesByTaskId(id)),
      map((assignees) =>
        assignees.map((assignee) => ({ text: this.fullNamePipe.transform(assignee), value: assignee.id })),
      ),
      tap((assignees) => {
        this._populateAssigneeDropDown(assignees);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchNotFoundRequest(ErrorCode.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
    );
  }

  returnToUrl(requestTaskActionType: string): string {
    switch (requestTaskActionType) {
      case 'PERMIT_REVOCATION_NOTIFY_OPERATOR_FOR_WITHDRAWAL':
        return '/dashboard';
      default:
        return '..';
    }
  }

  onSubmit(): void {
    if (this.form.valid || !this.hasSignature) {
      const payloadType = this.getPayloadType();

      of(this.taskId)
        .pipe(
          switchMap((taskId) =>
            this.tasksService.processRequestTaskAction({
              requestTaskActionType: this.requestTaskActionType,
              requestTaskId: taskId,
              requestTaskActionPayload: {
                payloadType,
                decisionNotification: {
                  operators: this.form.get('users').value,
                  externalContacts: this.form.get('contacts').value,
                  signatory: this.form.get('assignees').value,
                },
              } as RequestTaskActionPayload,
            }),
          ),
          this.pendingRequest.trackRequest(),
          catchNotFoundRequest(ErrorCode.NOTFOUND1001, () =>
            this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
          ),
          catchBadRequest(
            [
              BusinessErrorCode.NOTIF1000,
              BusinessErrorCode.NOTIF1001,
              BusinessErrorCode.NOTIF1002,
              BusinessErrorCode.NOTIF1003,
              BusinessErrorCode.ACCOUNT1001,
            ],
            (res) => {
              return templateError(res, this.isTemplateGenerationErrorDisplayed$, this.errorMessage$);
            },
          ),
          catchTaskReassignedBadRequest(() =>
            this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
          ),
        )
        .subscribe(() => {
          this.isFormSubmitted$.next(true);
        });
    } else {
      this.isSummaryDisplayed.next(true);
    }
  }

  private getPayloadType(): RequestTaskActionPayload['payloadType'] {
    let payloadType: RequestTaskActionPayload['payloadType'];

    return payloadType;
  }

  private _populateAssigneeDropDown(
    assignees: {
      text: string;
      value: string;
    }[],
  ) {
    this.authStore
      .pipe(selectUserState)
      .pipe(
        take(1),
        map((userState) => userState.userId),
      )
      .subscribe((userId) => {
        const res = assignees.find((a) => a.value === userId);

        if (res) {
          this.form.get('assignees').setValue(res.value);
        }
      });
  }
}
