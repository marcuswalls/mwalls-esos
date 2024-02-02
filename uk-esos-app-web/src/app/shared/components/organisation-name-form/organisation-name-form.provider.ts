import { UntypedFormBuilder } from '@angular/forms';

import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';

import { GovukValidators } from 'govuk-components';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';

export const organisationNameFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [UntypedFormBuilder, ORGANISATION_ACCOUNT_STATE_PROVIDER],
  useFactory: (fb: UntypedFormBuilder, stateProvider: OrganisationAccountStateProvider) => {
    return fb.group({
      registeredName: [
        stateProvider.name,
        [
          GovukValidators.required('Enter the registered name of the organisation'),
          GovukValidators.maxLength(255, 'The registered name should not be more than 255 characters'),
        ],
      ],
    });
  },
};
