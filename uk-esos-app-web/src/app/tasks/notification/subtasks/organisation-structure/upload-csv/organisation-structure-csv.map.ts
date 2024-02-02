import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const organisationStructureCsvMap: Partial<Record<keyof OrganisationAssociatedWithRU, string>> = {
  organisationName: 'Organisation Name',
  registrationNumber: 'Registration Number (if exists, otherwise leave the cell blank)',
  isCoveredByThisNotification: 'Is this organisation covered in this notification?',
  isPartOfArrangement:
    'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?',
  isParentOfResponsibleUndertaking: 'Is this organisation a parent of the responsible undertaking?',
  isSubsidiaryOfResponsibleUndertaking: 'Is this organisation a subsidiary of the responsible undertaking?',
  isPartOfFranchise: 'Is this organisation part of a franchise group?',
  isTrust: 'Is this organisation a trust?',
  hasCeasedToBePartOfGroup:
    'Has this organisation ceased to be a part of the corporate group between 31 December 2022 and 5 June 2024?',
};

export const organisationStructureCSVMapper = (data: any): OrganisationAssociatedWithRU[] =>
  data.map((item: { [x: string]: unknown }) => ({
    organisationName: item?.[organisationStructureCsvMap.organisationName],
    registrationNumber: item?.[organisationStructureCsvMap.registrationNumber],
    isCoveredByThisNotification: item?.[organisationStructureCsvMap.isCoveredByThisNotification],
    isPartOfArrangement: item?.[organisationStructureCsvMap.isPartOfArrangement],
    isParentOfResponsibleUndertaking: item?.[organisationStructureCsvMap.isParentOfResponsibleUndertaking],
    isSubsidiaryOfResponsibleUndertaking: item?.[organisationStructureCsvMap.isSubsidiaryOfResponsibleUndertaking],
    isPartOfFranchise: item?.[organisationStructureCsvMap.isPartOfFranchise],
    isTrust: item?.[organisationStructureCsvMap.isTrust],
    hasCeasedToBePartOfGroup: item?.[organisationStructureCsvMap.hasCeasedToBePartOfGroup],
  }));

export const mapFieldsToColumnNames = (fields: [keyof OrganisationAssociatedWithRU]) => {
  return fields.map((field) => organisationStructureCsvMap[field]);
};
