import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import {
  LEAD_ASSESSOR_DETAILS_SUB_TASK,
  LeadAssessorDetailsCurrentStep,
  LeadAssessorDetailsWizardStep,
} from './lead-assessor-details.helper';
import { isWizardCompleted } from './leed-assessor-details.wizard';

export class LeadAssessorDetailsFlowManager extends StepFlowManager {
  override subtask = LEAD_ASSESSOR_DETAILS_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const leadAssessor = this.store.select(notificationQuery.selectLeadAssessor)();

    switch (currentStep) {
      case LeadAssessorDetailsCurrentStep.TYPE:
        return !isWizardCompleted(leadAssessor)
          ? `../${LeadAssessorDetailsWizardStep.STEP_DETAILS}`
          : LeadAssessorDetailsWizardStep.STEP_SUMMARY;

      case LeadAssessorDetailsCurrentStep.DETAILS:
        return !isWizardCompleted(leadAssessor)
          ? `../${LeadAssessorDetailsWizardStep.STEP_REQUIREMENTS}`
          : LeadAssessorDetailsWizardStep.STEP_SUMMARY;

      case LeadAssessorDetailsCurrentStep.REQUIREMENTS:
        return LeadAssessorDetailsWizardStep.STEP_SUMMARY;

      default:
        return '../../';
    }
  }
}
