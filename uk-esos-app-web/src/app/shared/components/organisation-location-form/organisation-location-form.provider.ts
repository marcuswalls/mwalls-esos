import { UntypedFormBuilder } from '@angular/forms';

import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';

import { GovukValidators } from 'govuk-components';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';

export const organisationLocationFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [UntypedFormBuilder, ORGANISATION_ACCOUNT_STATE_PROVIDER],
  useFactory: (fb: UntypedFormBuilder, stateProvider: OrganisationAccountStateProvider) => {
    const location = stateProvider.competentAuthority;
    return fb.group({
      location: [location, GovukValidators.required('Select the country that the organisation is located in')],
    });
  },
};
