import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './energy-savings-opportunity.helper';
import { isWizardCompleted } from './energy-savings-opportunity.wizard';

export const canActivateEnergySavingsOpportunity: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const energySavingsOpportunities = store.select(notificationQuery.selectEnergySavingsOpportunities)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(energySavingsOpportunities) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canActivateEnergySavingsOpportunitySummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const energySavingsOpportunities = store.select(notificationQuery.selectEnergySavingsOpportunities)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(energySavingsOpportunities)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.STEP1])
  );
};
