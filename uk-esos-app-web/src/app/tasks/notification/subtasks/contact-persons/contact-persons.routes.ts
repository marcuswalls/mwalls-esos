import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { backlinkResolver } from '@tasks/task-navigation';

import { canActivateContactPersons, canActivateContactPersonsSummary } from './contact-persons.guard';
import { ContactPersonsWizardStep } from './contact-persons.helper';

export const CONTACT_PERSONS_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateContactPersonsSummary],
        title: 'Contact persons',
        data: { breadcrumb: 'Contact persons' },
        loadComponent: () => import('./summary/summary.component').then((c) => c.ContactPersonsSummaryComponent),
      },
      {
        path: ContactPersonsWizardStep.PRIMARY_CONTACT,
        canActivate: [canActivateContactPersons],
        title: 'Primary contact details',
        loadComponent: () =>
          import('./primary-contact-details/primary-contact-details.component').then(
            (c) => c.PrimaryContactDetailsComponent,
          ),
      },
      {
        path: ContactPersonsWizardStep.ADD_SECONDARY_CONTACT,
        canActivate: [canActivateContactPersons],
        title: 'Do you want to add a secondary contact?',
        resolve: {
          backlink: backlinkResolver(ContactPersonsWizardStep.SUMMARY, ContactPersonsWizardStep.PRIMARY_CONTACT),
        },
        loadComponent: () =>
          import('./add-secondary-contact/add-secondary-contact.component').then((c) => c.AddSecondaryContactComponent),
      },
      {
        path: ContactPersonsWizardStep.SECONDARY_CONTACT,
        canActivate: [canActivateContactPersons],
        title: 'Secondary contact details',
        resolve: {
          backlink: backlinkResolver(ContactPersonsWizardStep.SUMMARY, ContactPersonsWizardStep.ADD_SECONDARY_CONTACT),
        },
        loadComponent: () =>
          import('./secondary-contact-details/secondary-contact-details.component').then(
            (c) => c.SecondaryContactDetailsComponent,
          ),
      },
    ],
  },
];
