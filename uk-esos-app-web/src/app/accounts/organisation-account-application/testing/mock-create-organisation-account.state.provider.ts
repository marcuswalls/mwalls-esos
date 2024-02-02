import { mockOrganisationAccountStore } from './mock-organisation-account.store';

export const mockCreateOrganisationAccountStateProvider = {
  get name() {
    return mockOrganisationAccountStore.state.name;
  },
  get competentAuthority() {
    return mockOrganisationAccountStore.state.competentAuthority;
  },
  get address() {
    return mockOrganisationAccountStore.state.address;
  },
  get registrationStatus() {
    return mockOrganisationAccountStore.state.registrationStatus;
  },
  get registrationNumber() {
    return mockOrganisationAccountStore.state.registrationNumber;
  },
};
