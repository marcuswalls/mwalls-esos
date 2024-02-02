import { OrganisationAssociatedWithRU, OrganisationDetails, OrganisationStructure } from 'esos-api';

export type Organisation = Partial<OrganisationAssociatedWithRU> &
  Partial<{ organisationDetails: string; name: OrganisationDetails['name'] }>;

export type RuOrganisation = Omit<OrganisationStructure, 'organisationsAssociatedWithRU'>;

export interface OrganisationStructureListTemplateViewModel {
  header: string;
  isListPreviousPage: boolean;
  wizardStep: { [s: string]: string };
  isEditable: boolean;
  organisationDetails: OrganisationDetails;
}
