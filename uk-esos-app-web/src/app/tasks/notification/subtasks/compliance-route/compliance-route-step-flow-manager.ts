import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep, WizardStep } from './compliance-route.helper';
import { isWizardCompleted } from './compliance-route-wizard-steps';

export class ComplianceRouteStepFlowManager extends StepFlowManager {
  override subtask = COMPLIANCE_ROUTE_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const complianceRoute = this.store.select(notificationQuery.selectComplianceRoute)();
    const category = this.store.select(notificationQuery.selectReportingObligationCategory)();
    const areDataEstimated = complianceRoute?.areDataEstimated;
    const energyConsumptionProfilingUsed = complianceRoute?.energyConsumptionProfilingUsed;
    const partsProhibitedFromDisclosingExist = complianceRoute?.partsProhibitedFromDisclosingExist;

    switch (currentStep) {
      case CurrentStep.DATA_ESTIMATED:
        return !isWizardCompleted(complianceRoute, category)
          ? areDataEstimated
            ? `../${WizardStep.ESTIMATION_METHODS_RECORDED}`
            : ['ISO_50001_COVERING_ENERGY_USAGE', 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'].includes(category)
            ? `../${WizardStep.PROHIBITED_DISCLOSING}`
            : `../${WizardStep.TWELVE_MONTHS_VERIFIABLE_DATA}`
          : WizardStep.SUMMARY;

      case CurrentStep.ESTIMATION_METHODS_RECORDED:
        return !isWizardCompleted(complianceRoute, category)
          ? ['ISO_50001_COVERING_ENERGY_USAGE', 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'].includes(category)
            ? `../${WizardStep.PROHIBITED_DISCLOSING}`
            : `../${WizardStep.ENERGY_CONSUMPTION_PROFILING}`
          : WizardStep.SUMMARY;

      case CurrentStep.TWELVE_MONTHS_VERIFIABLE_DATA:
        return !isWizardCompleted(complianceRoute, category)
          ? `../${WizardStep.ENERGY_CONSUMPTION_PROFILING}`
          : WizardStep.SUMMARY;

      case CurrentStep.ENERGY_CONSUMPTION_PROFILING:
        return !isWizardCompleted(complianceRoute, category)
          ? energyConsumptionProfilingUsed == 'YES'
            ? `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED}`
            : `../${WizardStep.ENERGY_AUDITS}`
          : WizardStep.SUMMARY;

      case CurrentStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED:
      case CurrentStep.ENERGY_AUDITS:
        return !isWizardCompleted(complianceRoute, category)
          ? `../${WizardStep.PROHIBITED_DISCLOSING}`
          : WizardStep.SUMMARY;

      case CurrentStep.ADD_ENERGY_AUDIT:
      case CurrentStep.REMOVE_ENERGY_AUDIT:
        return `../${WizardStep.ENERGY_AUDITS}`;

      case CurrentStep.EDIT_ENERGY_AUDIT:
        return `../../${WizardStep.ENERGY_AUDITS}`;

      case CurrentStep.REMOVE_ENERGY_AUDIT_SUMMARY:
        return './';

      case CurrentStep.PROHIBITED_DISCLOSING:
        return !isWizardCompleted(complianceRoute, category) && partsProhibitedFromDisclosingExist
          ? `../${WizardStep.PROHIBITED_DISCLOSING_PARTS}`
          : WizardStep.SUMMARY;

      case CurrentStep.PROHIBITED_DISCLOSING_PARTS:
        return !isWizardCompleted(complianceRoute, category)
          ? `../${WizardStep.PROHIBITED_DISCLOSING_REASON}`
          : WizardStep.SUMMARY;

      case CurrentStep.PROHIBITED_DISCLOSING_REASON:
        return WizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}
