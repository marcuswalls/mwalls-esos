import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { LeadAssessorDetailsWizardStep } from './lead-assessor-details.helper';
import { isWizardCompleted } from './leed-assessor-details.wizard';

export const canActivateLeadAssessorDetails: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const leadAssessor = store.select(notificationQuery.selectLeadAssessor)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(leadAssessor) || !!route.queryParams.change)) ||
    createUrlTreeFromSnapshot(route, [LeadAssessorDetailsWizardStep.STEP_SUMMARY])
  );
};

export const canActivateLeadAssessorDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const leadAssessor = store.select(notificationQuery.selectLeadAssessor)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(leadAssessor)) ||
    createUrlTreeFromSnapshot(route, ['./', LeadAssessorDetailsWizardStep.STEP_TYPE])
  );
};
