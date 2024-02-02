import { Routes } from '@angular/router';

import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import {
  canActivateResponsibleUndertaking,
  canActivateResponsibleUndertakingSummary,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.guard';
import { WizardStep } from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { backlinkResolver } from '@tasks/task-navigation';

export const RESPONSIBLE_UNDERTAKING_ROUTES: Routes = [
  {
    path: '',
    title: `${responsibleUndertakingMap.title}`,
    data: {
      breadcrumb: `${responsibleUndertakingMap.title}`,
    },
    canActivate: [canActivateResponsibleUndertakingSummary],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/summary').then((c) => c.SummaryComponent),
  },
  {
    path: WizardStep.ORGANISATION_DETAILS,
    title: responsibleUndertakingMap.organisationDetails.title,
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/organisation-details').then(
        (c) => c.OrganisationDetailsComponent,
      ),
  },
  {
    path: WizardStep.TRADING_DETAILS,
    title: responsibleUndertakingMap.tradingDetails.title,
    resolve: {
      backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ORGANISATION_DETAILS),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/trading-details').then(
        (c) => c.TradingDetailsComponent,
      ),
  },
  {
    path: WizardStep.ORGANISATION_CONTACT_DETAILS,
    title: responsibleUndertakingMap.organisationContactDetails.title,
    resolve: {
      backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.TRADING_DETAILS),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/organisation-contact-details').then(
        (c) => c.OrganisationContactDetailsComponent,
      ),
  },
  {
    path: WizardStep.HAS_OVERSEAS_PARENT_DETAILS,
    title: responsibleUndertakingMap.hasOverseasParentDetails.title,
    resolve: {
      backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.ORGANISATION_CONTACT_DETAILS),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details-question').then(
        (c) => c.OverseasParentDetailsQuestionComponent,
      ),
  },
  {
    path: WizardStep.OVERSEAS_PARENT_DETAILS,
    title: responsibleUndertakingMap.overseasParentDetails.title,
    resolve: {
      backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.HAS_OVERSEAS_PARENT_DETAILS),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details').then(
        (c) => c.OverseasParentDetailsComponent,
      ),
  },
];
