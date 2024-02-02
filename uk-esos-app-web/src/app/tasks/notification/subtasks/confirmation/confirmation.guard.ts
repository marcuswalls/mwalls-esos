import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './confirmation.helper';
import { isWizardCompleted } from './confirmation.wizard';

export const canActivateConfirmation: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const confirmation = store.select(notificationQuery.selectConfirmation)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const leadAssessorType = store.select(notificationQuery.selectLeadAssessor)()?.leadAssessorType;

  return (
    (isEditable &&
      (!isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType) ||
        !!route.queryParams.change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.STEP_SUMMARY])
  );
};

export const canActivateConfirmationSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const confirmation = store.select(notificationQuery.selectConfirmation)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const leadAssessorType = store.select(notificationQuery.selectLeadAssessor)()?.leadAssessorType;

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType)) ||
    (reportingObligationCategory !== 'ZERO_ENERGY' &&
      createUrlTreeFromSnapshot(route, ['./', WizardStep.STEP_ASSESSMENT_TYPES])) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.STEP_NO_ENERGY_ASSESSMENT_TYPES])
  );
};
