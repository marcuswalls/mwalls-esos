import { StepFlowManager } from '@common/forms/step-flow';

import { CurrentStep, ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK, WizardStep } from './energy-savings-opportunity.helper';

export class EnergySavingsOpportunityStepFlowManager extends StepFlowManager {
  override subtask = ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case CurrentStep.STEP1:
        return `../${WizardStep.STEP2}`;

      case CurrentStep.STEP2:
        return WizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}
