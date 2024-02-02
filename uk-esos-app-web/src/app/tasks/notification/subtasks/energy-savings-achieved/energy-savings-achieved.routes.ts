import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';

import {
  canActivateEnergySavingsAchieved,
  canActivateEnergySavingsAchievedDetails,
  canActivateEnergySavingsAchievedIncludingRouteB,
  canActivateEnergySavingsAchievedSummary,
  canActivateEnergySavingsAchievedTotalEstimateRouteB,
} from './energy-savings-achieved.guard';
import { EnergySavingsAchievedWizardStep } from './energy-savings-achieved.helper';
import { energySavingsAchievedBacklinkResolver } from './energy-savings-achieved-backlink.resolver';

export const ENERGY_SAVINGS_ACHIEVED_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Energy savings achieved' },
        canActivate: [canActivateEnergySavingsAchievedSummary],
        title: 'Energy savings achieved',
        loadComponent: () => import('./energy-savings-achieved-summary/energy-savings-achieved-summary.component'),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_ESTIMATE,
        canActivate: [canActivateEnergySavingsAchieved],
        title: 'Energy savings achieved estimate breakdown',
        loadComponent: () => import('./energy-savings-achieved-estimate/energy-savings-achieved-estimate.component'),
      },
      {
        // 'ROUTE B' estimation total, if the 'ReportingObligationCategory' selected is 'ISO_50001_COVERING_ENERGY_USAGE'
        path: EnergySavingsAchievedWizardStep.STEP_ESTIMATE_TOTAL,
        canActivate: [canActivateEnergySavingsAchievedTotalEstimateRouteB],
        title: 'Energy savings achieved total estimate',
        loadComponent: () =>
          import('./energy-savings-achieved-estimate-total/energy-savings-achieved-estimate-total.component'),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_CATEGORIES_EXIST,
        data: { backlink: '../' },
        canActivate: [canActivateEnergySavingsAchieved],
        title: 'Energy savings achieved categories exist',
        loadComponent: () =>
          import('./energy-savings-achieved-categories-exist/energy-savings-achieved-categories-exist.component'),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_CATEGORIES,
        resolve: { backlink: energySavingsAchievedBacklinkResolver(EnergySavingsAchievedWizardStep.STEP_CATEGORIES) },
        canActivate: [canActivateEnergySavingsAchieved],
        title: 'Energy savings achieved categories',
        loadComponent: () =>
          import('./energy-savings-achieved-categories/energy-savings-achieved-categories.component'),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST,
        resolve: {
          backlink: energySavingsAchievedBacklinkResolver(EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST),
        },
        canActivate: [canActivateEnergySavingsAchievedIncludingRouteB],
        title: 'Energy savings achieved recommendations exist',
        loadComponent: () =>
          import(
            './energy-savings-achieved-recommendations-exist/energy-savings-achieved-recommendations-exist.component'
          ),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS,
        canActivate: [canActivateEnergySavingsAchievedIncludingRouteB],
        resolve: {
          backlink: energySavingsAchievedBacklinkResolver(EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS),
        },
        title: 'Energy savings achieved recommendations',
        loadComponent: () =>
          import('./energy-savings-achieved-recommendations/energy-savings-achieved-recommendations.component'),
      },
      {
        path: EnergySavingsAchievedWizardStep.STEP_DETAILS,
        resolve: { backlink: energySavingsAchievedBacklinkResolver(EnergySavingsAchievedWizardStep.STEP_DETAILS) },
        canActivate: [canActivateEnergySavingsAchievedDetails],
        title: 'Energy savings achieved details',
        loadComponent: () => import('./energy-savings-achieved-details/energy-savings-achieved-details.component'),
      },
    ],
  },
];
