import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, Observable, switchMap, withLatestFrom } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@core/store/auth';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';

import { ButtonDirective } from 'govuk-components';

import {
  AccountStatus,
  OrganisationAccountDTO,
  RequestCreateActionProcessDTO,
  RequestCreateValidationResult,
  RequestItemsService,
  RequestsService,
  UserStateDTO,
} from 'esos-api';

import { AboutNocP3DescriptionComponent } from './about-noc-p3-description/about-noc-p3-description.component';
import { processActionsDetailsTypesMap, WorkflowLabel, WorkflowMap } from './process-actions-map';

@Component({
  selector: 'esos-process-actions',
  templateUrl: './process-actions.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    AboutNocP3DescriptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessActionsComponent implements OnInit {
  accountId$: Observable<number>;
  availableTasks$: Observable<WorkflowLabel[]>;

  private operatorsWorkflowMessagesMap: Partial<WorkflowMap> = {
    NOTIFICATION_OF_COMPLIANCE_P3: {
      title: 'Phase 3 Notification',
      button: 'Start',
    },
  };

  private regulatorsWorkflowMessagesMap: Partial<WorkflowMap> = {};

  private userRoleWorkflowsMap: Record<UserStateDTO['roleType'], Partial<WorkflowMap>> = {
    OPERATOR: this.operatorsWorkflowMessagesMap,
    REGULATOR: this.regulatorsWorkflowMessagesMap,
    VERIFIER: undefined,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly requestItemsService: RequestItemsService,
    private readonly authStore: AuthStore,
    private readonly router: Router,
    private readonly itemLinkPipe: ItemLinkPipe,
  ) {}

  ngOnInit(): void {
    this.accountId$ = this.activatedRoute.paramMap.pipe(map((parameters) => +parameters.get('accountId')));
    // request for available tasks
    this.availableTasks$ = this.accountId$.pipe(
      switchMap((accountId) => this.requestsService.getAvailableAccountWorkflows(accountId)),
      withLatestFrom(
        this.authStore.pipe(
          selectUserRoleType,
          map((roleType) => this.userRoleWorkflowsMap[roleType]),
        ),
      ),
      map(([validationResults, userRoleWorkflowMessagesMap]) =>
        Object.entries(validationResults)
          .filter(([type]) => userRoleWorkflowMessagesMap[type])
          .map(([type, result]) => ({
            ...userRoleWorkflowMessagesMap[type],
            type: type,
            errors: result.valid
              ? undefined
              : this.createErrorMessages(type as RequestCreateActionProcessDTO['requestCreateActionType'], result),
          })),
      ),
    );
  }

  onRequestButtonClick(requestType: RequestCreateActionProcessDTO['requestCreateActionType']) {
    this.accountId$
      .pipe(
        switchMap((accountId) =>
          this.requestsService.processRequestCreateAction(
            {
              requestCreateActionType: requestType,
              requestCreateActionPayload: {
                payloadType: 'EMPTY_PAYLOAD',
              },
            },
            accountId,
          ),
        ),
        switchMap(({ requestId }) => this.requestItemsService.getItemsByRequest(requestId)),
        first(),
      )
      .subscribe(({ items }) => {
        const link = items?.length == 1 ? this.itemLinkPipe.transform(items[0]) : ['/dashboard'];
        this.router.navigate(link).then();
      });
  }

  private createErrorMessages(
    requestType: RequestCreateActionProcessDTO['requestCreateActionType'],
    result: RequestCreateValidationResult,
  ): string[] {
    const status = result?.accountStatus as unknown as OrganisationAccountDTO['status'];
    const typeString = processActionsDetailsTypesMap[requestType];
    if (status && !result?.applicableAccountStatuses?.includes(status as AccountStatus)) {
      const accountStatusString = new AccountStatusPipe().transform(status)?.toUpperCase();

      return [`You cannot start the ${typeString} while the account status is ${accountStatusString}.`];
    } else {
      return result.requests.map((r) =>
        this.createErrorMessage(requestType, r as RequestCreateActionProcessDTO['requestCreateActionType']),
      );
    }
  }

  private createErrorMessage(
    currentRequestType: RequestCreateActionProcessDTO['requestCreateActionType'],
    resultRequestType: RequestCreateActionProcessDTO['requestCreateActionType'],
  ): string {
    const currentRequestTypeString = processActionsDetailsTypesMap[currentRequestType];
    const resultRequestTypeString = processActionsDetailsTypesMap[resultRequestType];

    if (currentRequestType === resultRequestType) {
      return `You cannot start the ${currentRequestTypeString} process as it is already in progress.`;
    } else {
      return `You cannot start the ${currentRequestTypeString} process while the ${resultRequestTypeString} is in progress.`;
    }
  }
}
