import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './alternative-compliance-routes.helper';
import { isWizardCompleted } from './alternative-compliance-routes.wizard';

export const canActivateAlternativeComplianceRoutes: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const alternativeComplianceRoutes = store.select(notificationQuery.selectAlternativeComplianceRoutes)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(alternativeComplianceRoutes) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canActivateAlternativeComplianceRoutesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const alternativeComplianceRoutes = store.select(notificationQuery.selectAlternativeComplianceRoutes)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();

  const firstStep =
    reportingObligationCategory === 'PARTIAL_ENERGY_ASSESSMENTS' ||
    reportingObligationCategory === 'LESS_THAN_40000_KWH_PER_YEAR' ||
    reportingObligationCategory === 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'
      ? WizardStep.ENERGY_CONSUMPTION_REDUCTION
      : WizardStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION;

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(alternativeComplianceRoutes)) ||
    createUrlTreeFromSnapshot(route, [firstStep])
  );
};
