import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { isWizardCompleted } from '@tasks/notification/subtasks/compliance-periods/first-compliance-period/first-compliance-period.wizard';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export const canActivateFirstCompliancePeriod: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const firstCompliancePeriod = store.select(notificationQuery.selectFirstCompliancePeriod)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const wizardCompleted = isWizardCompleted(firstCompliancePeriod);

  return (isEditable && (!wizardCompleted || change)) || createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY]);
};

export const canActivateFirstCompliancePeriodSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const firstCompliancePeriod = store.select(notificationQuery.selectFirstCompliancePeriod)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const wizardCompleted = isWizardCompleted(firstCompliancePeriod);

  return (
    !isEditable ||
    (isEditable && wizardCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.INFORMATION_EXISTS])
  );
};
