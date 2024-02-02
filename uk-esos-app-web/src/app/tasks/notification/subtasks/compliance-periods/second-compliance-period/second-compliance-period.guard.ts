import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { isWizardCompleted } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/second-compliance-period.wizard';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export const canActivateSecondCompliancePeriod: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const secondCompliancePeriod = store.select(notificationQuery.selectSecondCompliancePeriod)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const wizardCompleted = isWizardCompleted(secondCompliancePeriod);

  return (isEditable && (!wizardCompleted || change)) || createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY]);
};

export const canActivateSecondCompliancePeriodSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const secondCompliancePeriod = store.select(notificationQuery.selectSecondCompliancePeriod)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const wizardCompleted = isWizardCompleted(secondCompliancePeriod);

  return (
    !isEditable ||
    (isEditable && wizardCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.INFORMATION_EXISTS])
  );
};
