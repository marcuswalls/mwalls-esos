import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { isWizardCompleted } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/second-compliance-period.wizard';
import {
  CurrentStep,
  SUB_TASK_SECOND_COMPLIANCE_PERIOD,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

import { SecondCompliancePeriod } from 'esos-api';

export class SecondCompliancePeriodStepFlowManager extends StepFlowManager {
  override subtask = SUB_TASK_SECOND_COMPLIANCE_PERIOD;

  private resolveIfWizardCompleted(currentStep: string, secondCompliancePeriod: SecondCompliancePeriod): string | null {
    if (isWizardCompleted(secondCompliancePeriod) && currentStep === CurrentStep.SUMMARY) {
      return `../../`;
    } else if (isWizardCompleted(secondCompliancePeriod)) {
      return `../${WizardStep.SUMMARY}`;
    }
    return null;
  }

  override resolveNextStepRoute(currentStep: string): string {
    const secondCompliancePeriod = this.store.select(notificationQuery.selectSecondCompliancePeriod)();

    const completedRoute = this.resolveIfWizardCompleted(currentStep, secondCompliancePeriod);
    if (completedRoute) {
      return completedRoute;
    }

    switch (currentStep) {
      case CurrentStep.INFORMATION_EXISTS:
        return secondCompliancePeriod.informationExists
          ? `../${WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION}`
          : `../${WizardStep.SUMMARY}`;

      case CurrentStep.ORGANISATIONAL_ENERGY_CONSUMPTION:
        return `../${WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS}`;

      case CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS:
        return secondCompliancePeriod.firstCompliancePeriodDetails.significantEnergyConsumptionExists
          ? `../${WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION}`
          : `../${WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION}`;

      case CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION:
        return `../${WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION}`;

      case CurrentStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION:
        return `../${WizardStep.POTENTIAL_REDUCTION_EXISTS}`;

      case CurrentStep.POTENTIAL_REDUCTION_EXISTS:
        return secondCompliancePeriod.firstCompliancePeriodDetails.potentialReductionExists
          ? `../${WizardStep.POTENTIAL_REDUCTION}`
          : `../${WizardStep.REDUCTION_ACHIEVED_EXISTS}`;

      case CurrentStep.POTENTIAL_REDUCTION:
        return `../${WizardStep.REDUCTION_ACHIEVED_EXISTS}`;

      case CurrentStep.REDUCTION_ACHIEVED_EXISTS:
        return secondCompliancePeriod.reductionAchievedExists
          ? `../${WizardStep.REDUCTION_ACHIEVED}`
          : `../${WizardStep.SUMMARY}`;

      case CurrentStep.REDUCTION_ACHIEVED:
        return `../${WizardStep.SUMMARY}`;
    }
  }
}
