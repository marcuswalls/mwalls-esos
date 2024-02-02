import { OrganisationStructure } from 'esos-api';

export const isWizardCompleted = (organisationStructure: OrganisationStructure) => {
  const { isPartOfArrangement, isPartOfFranchise, isTrust, hasCeasedToBePartOfGroup } = organisationStructure ?? {};

  const isRuDetailsCompleted =
    isPartOfArrangement != null && isPartOfFranchise != null && isTrust != null && hasCeasedToBePartOfGroup != null;

  return isRuDetailsCompleted;
};
