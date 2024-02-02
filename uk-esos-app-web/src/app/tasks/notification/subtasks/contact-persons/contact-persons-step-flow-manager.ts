import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import {
  CONTACT_PERSONS_SUB_TASK,
  ContactPersonsCurrentStep,
  ContactPersonsWizardStep,
} from './contact-persons.helper';
import { isWizardCompleted } from './contact-persons.wizard';

export class ContactPersonsStepFlowManager extends StepFlowManager {
  override subtask = CONTACT_PERSONS_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const contactPersons = this.store.select(notificationQuery.selectContactPersons)();
    const hasSecondaryContact = contactPersons.hasSecondaryContact;

    switch (currentStep) {
      case ContactPersonsCurrentStep.PRIMARY_CONTACT:
        return !isWizardCompleted(contactPersons)
          ? `../${ContactPersonsWizardStep.ADD_SECONDARY_CONTACT}`
          : ContactPersonsWizardStep.SUMMARY;
      case ContactPersonsCurrentStep.ADD_SECONDARY_CONTACT:
        return !isWizardCompleted(contactPersons)
          ? hasSecondaryContact
            ? `../${ContactPersonsWizardStep.SECONDARY_CONTACT}`
            : ContactPersonsWizardStep.SUMMARY
          : ContactPersonsWizardStep.SUMMARY;
      case ContactPersonsCurrentStep.SECONDARY_CONTACT:
        return ContactPersonsWizardStep.SUMMARY;
      default:
        return '../../';
    }
  }
}
