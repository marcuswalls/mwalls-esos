import { BehaviorSubject } from 'rxjs';

import { initialState, OrganisationAccountOpeningApplicationState } from '../+state/organisation-account.state';

export const mockOrganisationAccountStore = {
  _state: new BehaviorSubject<OrganisationAccountOpeningApplicationState>(initialState),

  get state() {
    return this._state.value;
  },

  get state$() {
    return this._state.asObservable();
  },

  setRegistrationStatus: jest.fn((registrationStatus: boolean) => {
    const updatedState = { ...mockOrganisationAccountStore.state, registrationStatus };
    mockOrganisationAccountStore._state.next(updatedState);
  }),

  setRegistrationNumber: jest.fn((registrationNumber: string) => {
    const updatedState = { ...mockOrganisationAccountStore.state, registrationNumber };
    mockOrganisationAccountStore._state.next(updatedState);
  }),

  setRegisteredName: jest.fn((name: string) => {
    const updatedState = { ...mockOrganisationAccountStore.state, name };
    mockOrganisationAccountStore._state.next(updatedState);
  }),

  setAddress: jest.fn((address) => {
    const updatedState = { ...mockOrganisationAccountStore.state, address };
    mockOrganisationAccountStore._state.next(updatedState);
  }),

  setLocation: jest.fn((competentAuthority) => {
    const updatedState = { ...mockOrganisationAccountStore.state, competentAuthority };
    mockOrganisationAccountStore._state.next(updatedState);
  }),
};
