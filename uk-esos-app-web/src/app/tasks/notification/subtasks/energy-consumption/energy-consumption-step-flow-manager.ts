import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  CurrentStep,
  ENERGY_CONSUMPTION_SUB_TASK,
  WizardStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';

export class EnergyConsumptionStepFlowManager extends StepFlowManager {
  override subtask = ENERGY_CONSUMPTION_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const energyConsumption = this.store.select(notificationQuery.selectEnergyConsumption)();

    switch (currentStep) {
      case CurrentStep.TOTAL_ENERGY:
        return '../' + WizardStep.USE_SIGNIFICANT_ENERGY;
      case CurrentStep.USE_SIGNIFICANT_ENERGY:
        return energyConsumption.significantEnergyConsumptionExists
          ? '../' + WizardStep.SIGNIFICANT_ENERGY
          : '../' + WizardStep.ENERGY_INTENSITY_RATIO;
      case CurrentStep.SIGNIFICANT_ENERGY:
        return '../' + WizardStep.ENERGY_INTENSITY_RATIO;
      case CurrentStep.ENERGY_INTENSITY_RATIO:
        return '../' + WizardStep.ADDITIONAL_INFO;
      case CurrentStep.ADDITIONAL_INFO:
        return WizardStep.SUMMARY;
      default:
        return '../../';
    }
  }
}
