import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { CreateOrganisationAccountStateProvider } from './+state';
import {
  OrganisationAccountApplicationCancelComponent,
  OrganisationAccountApplicationReceivedComponent,
  OrganisationAccountApplicationSummaryPageComponent,
} from './components';
import { OrganisationAddressContainerComponent } from './components/organisation-address-container/organisation-address.container.component';
import { OrganisationCompaniesHouseContainerComponent } from './components/organisation-companies-house-container/organisation-companies-house-container.component';
import { OrganisationLocationContainerComponent } from './components/organisation-location-container/organisation-location-container.component';
import { OrganisationNameContainerComponent } from './components/organisation-name-container/organisation-name-container.component';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: ORGANISATION_ACCOUNT_STATE_PROVIDER,
        useClass: CreateOrganisationAccountStateProvider,
      },
    ],
    data: {
      breadcrumb: 'Apply for an organisation account',
    },
    children: [
      {
        path: '',
        component: OrganisationCompaniesHouseContainerComponent,
      },
      {
        path: 'name',
        component: OrganisationNameContainerComponent,
        data: {
          backlink: '..',
        },
      },
      {
        path: 'address',
        component: OrganisationAddressContainerComponent,
        data: {
          backlink: '../name',
        },
      },
      {
        path: 'location',
        component: OrganisationLocationContainerComponent,
        data: {
          backlink: '../address',
        },
      },
    ],
  },
  {
    path: 'cancel',
    data: { pageTitle: 'Cancel Organisation account creation', breadcrumb: true },
    component: OrganisationAccountApplicationCancelComponent,
  },
  {
    path: 'summary',
    data: {
      pageTitle: 'Check the information provided before submitting',
      breadcrumb: 'Organisation account summary',
    },
    //TODO SummaryGuard should be created here.
    // canActivate: [SummaryGuard],
    component: OrganisationAccountApplicationSummaryPageComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'submitted',
    data: {
      pageTitle: 'Your organisation account has been created',
    },
    component: OrganisationAccountApplicationReceivedComponent,
  },
];
