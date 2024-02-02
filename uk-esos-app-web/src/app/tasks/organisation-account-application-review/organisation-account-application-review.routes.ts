import { Routes } from '@angular/router';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';
import { OrganisationAccountApplicationReviewStateProvider } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review.state.provider';
import { OrganisationAccountApplicationReviewSubmittedComponent } from '@tasks/organisation-account-application-review/components/organisation-account-application-reviewed/organisation-account-application-review-submitted.component';
import { OrganisationAmendAddressContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-address-container/organisation-amend-address-container.component';
import { OrganisationAmendCompaniesHouseContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-companies-house-container/organisation-amend-companies-house-container.component';
import { OrganisationAmendLocationContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-location-container/organisation-amend-location-container.component';
import { OrganisationAmendNameContainerComponent } from '@tasks/organisation-account-application-review/components/organisation-amend-name-container/organisation-amend-name-container.component';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: ORGANISATION_ACCOUNT_STATE_PROVIDER,
        useClass: OrganisationAccountApplicationReviewStateProvider,
      },
    ],
    children: [
      {
        path: '',
        component: OrganisationAmendCompaniesHouseContainerComponent,
      },
      {
        path: 'name',
        component: OrganisationAmendNameContainerComponent,
      },
      {
        path: 'address',
        component: OrganisationAmendAddressContainerComponent,
      },
      {
        path: 'location',
        component: OrganisationAmendLocationContainerComponent,
      },
      {
        path: 'submitted',
        component: OrganisationAccountApplicationReviewSubmittedComponent,
      },
    ],
  },
];
