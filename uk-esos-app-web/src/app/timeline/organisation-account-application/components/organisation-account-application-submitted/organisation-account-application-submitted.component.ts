import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';
import { ParticipantUserDetailsComponent } from '@shared/components/participant-user-details';

import { OrganisationAccountPayload, OrganisationParticipantDetails } from 'esos-api';

import { organisationAccountApplicationTimelineQuery } from '../../+state/organisation-account-application.selectors';

type ViewModel = {
  accountDetails: OrganisationAccountPayload;
  userDetails: OrganisationParticipantDetails;
};

@Component({
  selector: 'esos-organisation-account-application-submitted',
  standalone: true,
  imports: [OrganisationAccountSummaryComponent, ParticipantUserDetailsComponent, NgIf],
  templateUrl: './organisation-account-application-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAccountApplicationSubmittedComponent {
  vm: Signal<ViewModel> = computed(() => ({
    accountDetails: this.store.select(organisationAccountApplicationTimelineQuery.selectAccountDetails)(),
    userDetails: this.store.select(organisationAccountApplicationTimelineQuery.selectUserDetails)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
