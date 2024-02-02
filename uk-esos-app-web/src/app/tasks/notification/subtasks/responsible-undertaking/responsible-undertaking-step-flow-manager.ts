import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  CurrentStep,
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  WizardStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';

import { NocP3 } from 'esos-api';

export class ResponsibleUndertakingStepFlowManager extends StepFlowManager {
  override subtask: keyof NocP3 = RESPONSIBLE_UNDERTAKING_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const responsibleUndertaking = this.store.select(notificationQuery.selectResponsibleUndertaking)();
    const hasOverseasParentDetails = responsibleUndertaking.hasOverseasParentDetails;

    switch (currentStep) {
      case CurrentStep.ORGANISATION_DETAILS:
        return `../${WizardStep.TRADING_DETAILS}`;

      case CurrentStep.TRADING_DETAILS:
        return `../${WizardStep.ORGANISATION_CONTACT_DETAILS}`;

      case CurrentStep.ORGANISATION_CONTACT_DETAILS:
        return `../${WizardStep.HAS_OVERSEAS_PARENT_DETAILS}`;

      case CurrentStep.HAS_OVERSEAS_PARENT_DETAILS:
        return hasOverseasParentDetails ? `../${WizardStep.OVERSEAS_PARENT_DETAILS}` : WizardStep.SUMMARY;

      case CurrentStep.OVERSEAS_PARENT_DETAILS:
        return WizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}
