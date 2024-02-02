import { Routes } from '@angular/router';

import { backlinkResolver } from '@tasks/task-navigation';

import { canActivateLeadAssessorDetails, canActivateLeadAssessorDetailsSummary } from './lead-assessor-details.guard';
import { LeadAssessorDetailsWizardStep } from './lead-assessor-details.helper';

export const LEAD_ASSESSOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [canActivateLeadAssessorDetailsSummary],
    data: { breadcrumb: true },
    title: 'Lead assessor details',
    loadComponent: () => import('./summary/summary.component'),
  },
  {
    path: 'lead-assessor-type',
    canActivate: [canActivateLeadAssessorDetails],
    title: 'Lead assessor details',
    loadComponent: () => import('./lead-assessor-type/lead-assessor-type.component'),
  },
  {
    path: 'lead-assessor-provide-details',
    resolve: {
      backlink: backlinkResolver(LeadAssessorDetailsWizardStep.STEP_SUMMARY, LeadAssessorDetailsWizardStep.STEP_TYPE),
    },
    canActivate: [canActivateLeadAssessorDetails],
    title: 'Lead assessor details',
    loadComponent: () => import('./lead-assessor-provide-details/lead-assessor-provide-details.component'),
  },
  {
    path: 'lead-assessor-requirements',
    resolve: {
      backlink: backlinkResolver(
        LeadAssessorDetailsWizardStep.STEP_SUMMARY,
        LeadAssessorDetailsWizardStep.STEP_DETAILS,
      ),
    },
    canActivate: [canActivateLeadAssessorDetails],
    title: 'Lead assessor details',
    loadComponent: () => import('./lead-assessor-requirements/lead-assessor-requirements.component'),
  },
];
