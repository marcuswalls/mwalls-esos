import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';

import { notificationQuery } from '../../+state/notification.selectors';
import { ReportingObligationStepUrl } from './reporting-obligation.helper';
import {
  energyResponsibility,
  isWizardCompleted,
  qualificationReasons,
  qualificationType,
} from './reporting-obligation.wizard';

export const canActivateReportingObligationSummary: CanActivateFn = (route) => {
  const isEditable = inject(RequestTaskStore).select(requestTaskQuery.selectIsEditable)() === true;
  return (
    isWizardCompleted() ||
    !isEditable ||
    createUrlTreeFromSnapshot(route, [ReportingObligationStepUrl.QUALIFICATION_TYPE])
  );
};

export const canActivateReportingObligationStep: CanActivateFn = (route) => {
  const changeParam = route.queryParamMap.get('change');

  const isEditable = inject(RequestTaskStore).select(requestTaskQuery.selectIsEditable)() === true;
  return ((!isWizardCompleted() || changeParam === 'true') && isEditable) || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateNoQualificationReasonStep: CanActivateFn = (route) => {
  const reportingObligation = inject(RequestTaskStore).select(notificationQuery.selectReportingObligation)();
  return qualificationType(reportingObligation) === 'NOT_QUALIFY' || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateQualificationReasonsStep: CanActivateFn = (route) => {
  const reportingObligation = inject(RequestTaskStore).select(notificationQuery.selectReportingObligation)();
  return qualificationType(reportingObligation) === 'QUALIFY' || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateEnergyResponsibilityStep: CanActivateFn = (route) => {
  const reportingObligation = inject(RequestTaskStore).select(notificationQuery.selectReportingObligation)();
  return (
    qualificationReasons(reportingObligation?.reportingObligationDetails)?.length > 0 ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateComplianceDistributionStep: CanActivateFn = (route) => {
  const reportingObligation = inject(RequestTaskStore).select(notificationQuery.selectReportingObligation)();
  const er = energyResponsibility(reportingObligation?.reportingObligationDetails);
  return (!!er && er !== 'NOT_RESPONSIBLE') || createUrlTreeFromSnapshot(route, ['../']);
};
