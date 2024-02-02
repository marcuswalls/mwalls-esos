import { UntypedFormBuilder } from '@angular/forms';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';

import { GovukValidators } from 'govuk-components';

export const organisationCompaniesHouseFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [UntypedFormBuilder, ORGANISATION_ACCOUNT_STATE_PROVIDER],
  useFactory: (fb: UntypedFormBuilder, stateProvider: OrganisationAccountStateProvider) => {
    const registrationNumber = stateProvider?.registrationNumber ?? '';
    return fb.group({
      registrationStatus: [stateProvider?.registrationStatus, GovukValidators.required('Please select an option')],
      registrationNumber: [
        { value: registrationNumber, disabled: registrationNumber === '' },
        [
          GovukValidators.required('Enter the registration number'),
          GovukValidators.maxLength(255, 'The registration number should not be more than 255 characters'),
        ],
      ],
    });
  },
};
