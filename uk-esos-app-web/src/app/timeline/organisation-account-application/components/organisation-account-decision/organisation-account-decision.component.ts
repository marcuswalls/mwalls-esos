import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';
import { ParticipantUserDetailsComponent } from '@shared/components/participant-user-details';

import { AccountOpeningDecisionPayload, OrganisationAccountPayload, OrganisationParticipantDetails } from 'esos-api';

import { organisationAccountApplicationTimelineQuery } from '../../+state/organisation-account-application.selectors';
import { OrganisationAccountDecisionDetailsComponent } from '../organisation-account-decision-details';

type ViewModel = {
  accountDetails: OrganisationAccountPayload;
  userDetails: OrganisationParticipantDetails;
  decision: AccountOpeningDecisionPayload;
};

@Component({
  selector: 'esos-organisation-account-decision',
  standalone: true,
  imports: [
    NgIf,
    OrganisationAccountSummaryComponent,
    ParticipantUserDetailsComponent,
    OrganisationAccountDecisionDetailsComponent,
  ],
  templateUrl: './organisation-account-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAccountDecisionComponent {
  vm: Signal<ViewModel> = computed(() => ({
    accountDetails: this.store.select(organisationAccountApplicationTimelineQuery.selectAccountDetails)(),
    userDetails: this.store.select(organisationAccountApplicationTimelineQuery.selectUserDetails)(),
    decision: this.store.select(organisationAccountApplicationTimelineQuery.selectDecision)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
