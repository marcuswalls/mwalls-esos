import { OrganisationDetails, OrganisationStructure, ReviewOrganisationDetails } from 'esos-api';

export interface OrganisationStructureViewModel {
  subtaskName?: string;
  data: OrganisationStructure;
  organisationDetails: OrganisationDetails | ReviewOrganisationDetails;
  isEditable: boolean;
  sectionsCompleted?: { [key: string]: string };
  wizardStep?: { [s: string]: string };
}
