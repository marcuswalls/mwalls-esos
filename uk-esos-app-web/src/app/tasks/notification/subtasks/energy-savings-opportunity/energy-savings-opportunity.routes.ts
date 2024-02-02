import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateEnergySavingsOpportunity,
  canActivateEnergySavingsOpportunitySummary,
} from './energy-savings-opportunity.guard';
import { WizardStep } from './energy-savings-opportunity.helper';
import { EnergySavingsOpportunityComponent } from './energy-savings-opportunity/energy-savings-opportunity.component';
import { EnergySavingsOpportunityCategoriesComponent } from './energy-savings-opportunity-categories/energy-savings-opportunity-categories.component';
import { EnergySavingsOpportunitySummaryComponent } from './energy-savings-opportunity-summary/energy-savings-opportunity-summary.component';

export const ENERGY_SAVINGS_OPPORTUNITY: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateEnergySavingsOpportunitySummary],
        title: 'Energy savings opportunity',
        data: { breadcrumb: 'Energy savings opportunity' },
        component: EnergySavingsOpportunitySummaryComponent,
      },
      {
        path: WizardStep.STEP1,
        canActivate: [canActivateEnergySavingsOpportunity],
        title: 'Energy savings opportunities estimate of potential annual reduction',
        component: EnergySavingsOpportunityComponent,
      },
      {
        path: WizardStep.STEP2,
        canActivate: [canActivateEnergySavingsOpportunity],
        resolve: { backlink: backlinkResolver(WizardStep.SUMMARY, WizardStep.STEP1) },
        title: 'Energy savings opportunities estimate of potential annual reduction categories',
        component: EnergySavingsOpportunityCategoriesComponent,
      },
    ],
  },
];
