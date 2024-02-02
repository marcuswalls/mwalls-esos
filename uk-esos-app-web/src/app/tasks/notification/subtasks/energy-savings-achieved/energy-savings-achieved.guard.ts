import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { EnergySavingsAchievedWizardStep } from './energy-savings-achieved.helper';
import { isWizardCompleted } from './energy-savings-achieved.wizard';

export const canActivateEnergySavingsAchieved: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(energySavingsAchieved, reportingObligationCategory) || change)) ||
    createUrlTreeFromSnapshot(route, [EnergySavingsAchievedWizardStep.SUMMARY])
  );
};

export const canActivateEnergySavingsAchievedTotalEstimateRouteB: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(energySavingsAchieved, reportingObligationCategory) || change)) ||
    createUrlTreeFromSnapshot(route, [EnergySavingsAchievedWizardStep.SUMMARY])
  );
};

export const canActivateEnergySavingsAchievedIncludingRouteB: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(energySavingsAchieved, reportingObligationCategory) || change)) ||
    createUrlTreeFromSnapshot(route, [EnergySavingsAchievedWizardStep.SUMMARY])
  );
};

export const canActivateEnergySavingsAchievedDetails: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(route, [EnergySavingsAchievedWizardStep.SUMMARY]);
};

export const canActivateEnergySavingsAchievedSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(energySavingsAchieved, reportingObligationCategory)) ||
    createUrlTreeFromSnapshot(route, [
      reportingObligationCategory === 'ISO_50001_COVERING_ENERGY_USAGE'
        ? `${EnergySavingsAchievedWizardStep.STEP_ESTIMATE_TOTAL}`
        : `${EnergySavingsAchievedWizardStep.STEP_ESTIMATE}`,
    ])
  );
};
