import { LeadAssessor } from 'esos-api';

export const isWizardCompleted = (leadAssessor: LeadAssessor) => {
  return (
    leadAssessor?.leadAssessorType &&
    leadAssessor?.hasLeadAssessorConfirmation != null &&
    !!leadAssessor?.leadAssessorDetails
  );
};
