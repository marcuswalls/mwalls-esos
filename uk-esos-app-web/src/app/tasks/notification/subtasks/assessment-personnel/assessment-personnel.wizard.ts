import { AssessmentPersonnel } from 'esos-api';

export const isWizardCompleted = (assessmentPersonnel: AssessmentPersonnel) => {
  return assessmentPersonnel?.personnel?.length > 0;
};
