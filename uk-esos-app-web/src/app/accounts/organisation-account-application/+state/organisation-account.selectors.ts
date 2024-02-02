import { createSelector, StateSelector } from '@common/store';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

import { OrganisationAccountOpeningApplicationState } from './organisation-account.state';

const selectRegistrationStatus: StateSelector<OrganisationAccountOpeningApplicationState, boolean> = createSelector(
  (state) => state.registrationStatus,
);

const selectRegistrationNumber: StateSelector<OrganisationAccountOpeningApplicationState, string> = createSelector(
  (state) => state.registrationNumber,
);

const selectName: StateSelector<OrganisationAccountOpeningApplicationState, string> = createSelector(
  (state) => state.name,
);

const selectAddress: StateSelector<OrganisationAccountOpeningApplicationState, CountyAddressDTO> = createSelector(
  (state) => state.address,
);

const selectCompetentAuthority: StateSelector<
  OrganisationAccountOpeningApplicationState,
  OrganisationAccountDTO['competentAuthority']
> = createSelector((state) => state.competentAuthority);

export const organisationAccountQuery = {
  selectRegistrationStatus,
  selectRegistrationNumber,
  selectName,
  selectAddress,
  selectCompetentAuthority,
};
