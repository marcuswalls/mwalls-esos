import { StepFlowManager } from '@common/forms/step-flow';

import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
  OrganisationStructureWizardStep,
} from './organisation-structure.helper';

export class OrganisationStructureStepFlowManager extends StepFlowManager {
  override subtask = ORGANISATION_STRUCTURE_SUB_TASK;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case OrganisationStructureCurrentStep.RU_DETAILS:
      case OrganisationStructureCurrentStep.ADD:
        return `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.LIST:
        return OrganisationStructureWizardStep.SUMMARY;
      case OrganisationStructureCurrentStep.EDIT:
        return `../../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.UPLOAD_CSV:
        return `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.SUMMARY:
        return '../../';

      default:
        return './';
    }
  }
}
