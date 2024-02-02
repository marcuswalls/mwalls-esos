import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './compliance-route.helper';

export const resolveEnergyConsumptionProfilingBackLink: ResolveFn<any> = () => {
  const store = inject(RequestTaskStore);
  const router = inject(Router);
  const areDataEstimated = store.select(notificationQuery.selectComplianceRoute)()?.areDataEstimated;
  const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

  return isChangeClicked
    ? WizardStep.SUMMARY
    : areDataEstimated
    ? `../${WizardStep.ESTIMATION_METHODS_RECORDED}`
    : `../${WizardStep.TWELVE_MONTHS_VERIFIABLE_DATA}`;
};

export const resolveProhibitedDisclosingBackLink: ResolveFn<any> = () => {
  const store = inject(RequestTaskStore);
  const router = inject(Router);
  const energyConsumptionProfilingUsed = store.select(notificationQuery.selectComplianceRoute)()
    ?.energyConsumptionProfilingUsed;
  const areDataEstimated = store.select(notificationQuery.selectComplianceRoute)()?.areDataEstimated;
  const category = store.select(notificationQuery.selectReportingObligationCategory)();
  const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

  if (isChangeClicked) {
    return WizardStep.SUMMARY;
  } else if (['ISO_50001_COVERING_ENERGY_USAGE', 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'].includes(category)) {
    if (areDataEstimated) {
      return `../${WizardStep.ESTIMATION_METHODS_RECORDED}`;
    } else {
      return `../${WizardStep.DATA_ESTIMATED}`;
    }
  } else if (energyConsumptionProfilingUsed == 'YES') {
    return `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED}`;
  } else {
    return `../${WizardStep.ENERGY_AUDITS}`;
  }
};
