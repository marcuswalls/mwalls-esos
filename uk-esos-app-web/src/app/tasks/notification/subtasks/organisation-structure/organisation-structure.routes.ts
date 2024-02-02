import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';

import {
  canActivateOrganisationStructure,
  canActivateOrganisationStructureSummary,
  canEditOrganisation,
} from './organisation-structure.guard';
import { OrganisationStructureWizardStep } from './organisation-structure.helper';

export const ORGANISATION_STRUCTURE_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateOrganisationStructureSummary],
        title: 'Organisation structure',
        data: { breadcrumb: 'Organisation structure' },
        loadComponent: () => import('./summary').then((c) => c.OrganisationStructureSummaryComponent),
      },
      {
        path: OrganisationStructureWizardStep.RU_DETAILS,
        canActivate: [canActivateOrganisationStructure],
        title: 'Enter details about the organisation structure of the responsible undertaking (RU)',
        loadComponent: () =>
          import('./responsible-undertaking-details').then((c) => c.ResponsibleUndertakingDetailsComponent),
      },
      {
        path: OrganisationStructureWizardStep.LIST,
        title: 'Add the organisations that are associated with this responsible undertaking',
        data: { backlink: `../${OrganisationStructureWizardStep.RU_DETAILS}` },
        loadComponent: () => import('./list').then((c) => c.OrganisationStructureListComponent),
      },
      {
        path: OrganisationStructureWizardStep.ADD,
        title: 'Add an organisation',
        data: { backlink: `../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./add-edit').then((c) => c.OrganisationStructureAddEditComponent),
      },
      {
        path: OrganisationStructureWizardStep.UPLOAD_CSV,
        title: 'Upload CSV',
        data: { backlink: `../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./upload-csv').then((c) => c.UploadCsvComponent),
      },
      {
        path: `:index/${OrganisationStructureWizardStep.EDIT}`,
        canActivate: [canEditOrganisation],
        title: 'Edit an organisation',
        data: { backlink: `../../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./add-edit').then((c) => c.OrganisationStructureAddEditComponent),
      },
    ],
  },
];
