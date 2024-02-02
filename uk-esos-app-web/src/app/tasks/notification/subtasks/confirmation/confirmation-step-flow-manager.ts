import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { CONFIRMATIONS_SUB_TASK, CurrentStep, WizardStep } from './confirmation.helper';
import { isWizardCompleted } from './confirmation.wizard';

export class ConfirmationStepFlowManager extends StepFlowManager {
  override subtask = CONFIRMATIONS_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const reportingObligationCategory = this.store.select(notificationQuery.selectReportingObligationCategory)();
    const confirmation = this.store.select(notificationQuery.selectConfirmation)();
    const leadAssessorType = this.store.select(notificationQuery.selectLeadAssessor)()?.leadAssessorType;

    switch (reportingObligationCategory) {
      case 'ESOS_ENERGY_ASSESSMENTS_95_TO_100':
      case 'PARTIAL_ENERGY_ASSESSMENTS':
      case 'LESS_THAN_40000_KWH_PER_YEAR':
      case 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100':
        switch (currentStep) {
          case CurrentStep.ASSESSMENT_TYPES:
            return !isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType)
              ? `../${WizardStep.STEP_OFFICER_DETAILS}`
              : WizardStep.STEP_SUMMARY;
          case CurrentStep.OFFICER_DETAILS:
            return !isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType)
              ? `../${WizardStep.STEP_ASSESSMENT_DATE}`
              : WizardStep.STEP_SUMMARY;
          case CurrentStep.ASSESSMENT_DATE:
            return !isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType) &&
              (leadAssessorType === 'INTERNAL' || reportingObligationCategory === 'LESS_THAN_40000_KWH_PER_YEAR')
              ? `../${WizardStep.STEP_SECOND_OFFICER_TYPES}`
              : WizardStep.STEP_SUMMARY;

          case CurrentStep.SECOND_OFFICER_TYPES:
            return !isWizardCompleted(confirmation, reportingObligationCategory, leadAssessorType)
              ? `../${WizardStep.STEP_SECOND_OFFICER_DETAILS}`
              : WizardStep.STEP_SUMMARY;

          case CurrentStep.SECOND_OFFICER_DETAILS:
            return WizardStep.STEP_SUMMARY;

          default:
            return '../../';
        }
      case 'ISO_50001_COVERING_ENERGY_USAGE':
        switch (currentStep) {
          case CurrentStep.ASSESSMENT_TYPES:
            return !isWizardCompleted(confirmation, reportingObligationCategory)
              ? `../${WizardStep.STEP_OFFICER_DETAILS}`
              : WizardStep.STEP_SUMMARY;
          case CurrentStep.OFFICER_DETAILS:
            return !isWizardCompleted(confirmation, reportingObligationCategory)
              ? `../${WizardStep.STEP_ASSESSMENT_DATE}`
              : WizardStep.STEP_SUMMARY;

          case CurrentStep.ASSESSMENT_DATE:
            return WizardStep.STEP_SUMMARY;

          default:
            return '../../';
        }

      case 'ZERO_ENERGY':
        switch (currentStep) {
          case CurrentStep.NO_ENERGY_ASSESSMENT_TYPES:
            return !isWizardCompleted(confirmation, reportingObligationCategory)
              ? `../${WizardStep.STEP_OFFICER_DETAILS}`
              : WizardStep.STEP_SUMMARY;

          case CurrentStep.OFFICER_DETAILS:
            return WizardStep.STEP_SUMMARY;

          default:
            return '../../';
        }
    }
  }
}
