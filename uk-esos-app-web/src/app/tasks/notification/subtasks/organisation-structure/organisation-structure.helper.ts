import { OrganisationDetails, ReviewOrganisationDetails } from 'esos-api';

export const ORGANISATION_STRUCTURE_SUB_TASK = 'organisationStructure';

export enum OrganisationStructureCurrentStep {
  RU_DETAILS = 'ruDetails',
  LIST = 'list',
  LIST_REMOVE = 'list-remove',
  ADD = 'add',
  EDIT = 'edit',
  UPLOAD_CSV = 'upload-csv',
  SUMMARY = 'summary',
}

export enum OrganisationStructureWizardStep {
  RU_DETAILS = 'responsible-undertaking-details',
  LIST = 'list',
  ADD = 'add',
  EDIT = 'edit',
  UPLOAD_CSV = 'upload-csv',
  SUMMARY = '../',
}

export const getOrganisationDetails = (
  organisationDetailsRu: ReviewOrganisationDetails,
  organisationDetailsOriginatedData: OrganisationDetails,
): OrganisationDetails | ReviewOrganisationDetails => {
  return organisationDetailsRu?.name ? organisationDetailsRu : organisationDetailsOriginatedData;
};
