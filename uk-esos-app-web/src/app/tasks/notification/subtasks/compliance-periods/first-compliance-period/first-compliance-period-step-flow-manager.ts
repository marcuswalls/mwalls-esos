import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { isWizardCompleted } from '@tasks/notification/subtasks/compliance-periods/first-compliance-period/first-compliance-period.wizard';
import {
  CurrentStep,
  SUB_TASK_FIRST_COMPLIANCE_PERIOD,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

import { FirstCompliancePeriod } from 'esos-api';

export class FirstCompliancePeriodStepFlowManager extends StepFlowManager {
  override subtask = SUB_TASK_FIRST_COMPLIANCE_PERIOD;

  private resolveIfWizardCompleted(currentStep: string, firstCompliancePeriod: FirstCompliancePeriod): string | null {
    if (isWizardCompleted(firstCompliancePeriod) && currentStep === CurrentStep.SUMMARY) {
      return `../../`;
    } else if (isWizardCompleted(firstCompliancePeriod)) {
      return `../${WizardStep.SUMMARY}`;
    }
    return null;
  }

  override resolveNextStepRoute(currentStep: string): string {
    const firstCompliancePeriod = this.store.select(notificationQuery.selectFirstCompliancePeriod)();

    const completedRoute = this.resolveIfWizardCompleted(currentStep, firstCompliancePeriod);
    if (completedRoute) {
      return completedRoute;
    }

    switch (currentStep) {
      case CurrentStep.INFORMATION_EXISTS:
        return firstCompliancePeriod.informationExists
          ? `../${WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION}`
          : `../${WizardStep.SUMMARY}`;

      case CurrentStep.ORGANISATIONAL_ENERGY_CONSUMPTION:
        return `../${WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS}`;

      case CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS:
        return firstCompliancePeriod.firstCompliancePeriodDetails.significantEnergyConsumptionExists
          ? `../${WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION}`
          : `../${WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION}`;

      case CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION:
        return `../${WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION}`;

      case CurrentStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION:
        return `../${WizardStep.POTENTIAL_REDUCTION_EXISTS}`;

      case CurrentStep.POTENTIAL_REDUCTION_EXISTS:
        return firstCompliancePeriod.firstCompliancePeriodDetails.potentialReductionExists
          ? `../${WizardStep.POTENTIAL_REDUCTION}`
          : `../${WizardStep.SUMMARY}`;

      case CurrentStep.POTENTIAL_REDUCTION:
        return `../${WizardStep.SUMMARY}`;
    }
  }
}
