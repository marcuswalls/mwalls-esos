import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './compliance-route.helper';
import { isWizardCompleted } from './compliance-route-wizard-steps';

export const canActivateComplianceRoute: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const complianceRoute = store.select(notificationQuery.selectComplianceRoute)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const category = store.select(notificationQuery.selectReportingObligationCategory)();

  return (
    (isEditable && (!isWizardCompleted(complianceRoute, category) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canActivateRouteAOrRouteCOrRouteE: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const complianceRoute = store.select(notificationQuery.selectComplianceRoute)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const category = store.select(notificationQuery.selectReportingObligationCategory)();

  return (
    (isEditable &&
      ['LESS_THAN_40000_KWH_PER_YEAR', 'ESOS_ENERGY_ASSESSMENTS_95_TO_100', 'PARTIAL_ENERGY_ASSESSMENTS'].includes(
        category,
      ) &&
      (!isWizardCompleted(complianceRoute, category) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canEditEnergyAudit: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const complianceRoute = store.select(notificationQuery.selectComplianceRoute)();
  const category = store.select(notificationQuery.selectReportingObligationCategory)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const index = +route.paramMap.get('index');

  const canEdit =
    ['LESS_THAN_40000_KWH_PER_YEAR', 'ESOS_ENERGY_ASSESSMENTS_95_TO_100', 'PARTIAL_ENERGY_ASSESSMENTS'].includes(
      category,
    ) &&
    index &&
    complianceRoute.energyAudits?.length &&
    !!complianceRoute.energyAudits[index - 1];

  return (isEditable && canEdit) || createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY]);
};

export const canActivateComplianceRouteSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const complianceRoute = store.select(notificationQuery.selectComplianceRoute)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const category = store.select(notificationQuery.selectReportingObligationCategory)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(complianceRoute, category)) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.DATA_ESTIMATED])
  );
};
