import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

import { SecondCompliancePeriod } from 'esos-api';

export const compliancePeriodBackLinkResolver = (summaryRoute: string, previousStepRoute: string) => {
  return () => {
    const router = inject(Router);
    const subtask = inject(COMPLIANCE_PERIOD_SUB_TASK);
    const store = inject(RequestTaskStore);
    const compliancePeriod =
      subtask === CompliancePeriodSubtask.FIRST
        ? store.select(notificationQuery.selectFirstCompliancePeriod)()
        : store.select(notificationQuery.selectSecondCompliancePeriod)();

    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    return isChangeClicked ? summaryRoute : `../${resolveBackLinkNavigationStep(previousStepRoute, compliancePeriod)}`;
  };
};

function resolveBackLinkNavigationStep(previousStepRoute: string, compliancePeriod: SecondCompliancePeriod): string {
  switch (previousStepRoute) {
    case WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION:
      return compliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumptionExists
        ? previousStepRoute
        : WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS;
    case WizardStep.POTENTIAL_REDUCTION:
      return compliancePeriod?.firstCompliancePeriodDetails?.potentialReductionExists
        ? previousStepRoute
        : WizardStep.POTENTIAL_REDUCTION_EXISTS;
    case WizardStep.REDUCTION_ACHIEVED:
      return compliancePeriod?.reductionAchievedExists ? previousStepRoute : WizardStep.REDUCTION_ACHIEVED_EXISTS;
    default:
      return previousStepRoute;
  }
}
