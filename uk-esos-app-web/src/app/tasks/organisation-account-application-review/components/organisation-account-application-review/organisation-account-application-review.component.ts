import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';
import { OrganisationAccountReviewDecisionComponent } from '@shared/components/decision/organisation-account-review-decision.component';
import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';
import { ParticipantUserDetailsComponent } from '@shared/components/participant-user-details/participant-user-details.component';
import { organisationAccountReviewQuery } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review.selectors';

import { OrganisationAccountOpeningApplicationRequestTaskPayload } from 'esos-api';

@Component({
  selector: 'esos-organisation-account-application-review',
  templateUrl: './organisation-account-application-review.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrganisationAccountReviewDecisionComponent,
    OrganisationAccountSummaryComponent,
    ParticipantUserDetailsComponent,
    NgIf,
  ],
})
export class OrganisationAccountApplicationReviewComponent {
  organisationTaskPayload: Signal<OrganisationAccountOpeningApplicationRequestTaskPayload>;
  isEditable: Signal<boolean>;

  constructor(readonly store: RequestTaskStore) {
    this.organisationTaskPayload = this.store.select(organisationAccountReviewQuery.selectPayload);
    this.isEditable = this.store.select(organisationAccountReviewQuery.selectIsEditable);
  }
}
