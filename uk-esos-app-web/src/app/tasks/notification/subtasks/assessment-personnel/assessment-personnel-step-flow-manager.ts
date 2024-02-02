import { StepFlowManager } from '@common/forms/step-flow';

import { ASSESSMENT_PERSONNEL_SUB_TASK, AssessmentPersonnelCurrentStep, AssessmentPersonnelWizardStep } from './assessment-personnel.helper';

export class AssessmentPersonnelStepFlowManager extends StepFlowManager {
  override subtask = ASSESSMENT_PERSONNEL_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case AssessmentPersonnelCurrentStep.LIST:
        return AssessmentPersonnelWizardStep.SUMMARY;

      case AssessmentPersonnelCurrentStep.FORM_ADD:
        return `../${AssessmentPersonnelWizardStep.STEP_LIST}`;

      case AssessmentPersonnelCurrentStep.FORM:
        return `../../${AssessmentPersonnelWizardStep.STEP_LIST}`;

      case AssessmentPersonnelCurrentStep.REMOVE:
        return `../../${AssessmentPersonnelWizardStep.STEP_LIST}`;

      default:
        return '../../';
    }
  }
}
