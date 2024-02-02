import { PersonnelDetails } from 'esos-api';

export const ASSESSMENT_PERSONNEL_SUB_TASK = 'assessmentPersonnel';

export enum AssessmentPersonnelCurrentStep {
  LIST = 'personnel-list',
  FORM = 'personnel-form',
  FORM_ADD = 'personnel-add',
  REMOVE = 'remove',
  SUMMARY = 'summary',
}

export enum AssessmentPersonnelWizardStep {
  STEP_LIST = 'personnel-list',
  STEP_FORM = 'personnel-form',
  STEP_REMOVE = 'remove',
  SUMMARY = '../',
}

export function sortPersonnel(personnel: PersonnelDetails[]): PersonnelDetails[] {
  const sortedPersonnel = [...personnel];

  sortedPersonnel.sort((a, b) => a.firstName.localeCompare(b.firstName));

  return sortedPersonnel;
}
