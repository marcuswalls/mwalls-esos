import { UntypedFormBuilder } from '@angular/forms';

import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';

import { GovukValidators } from 'govuk-components';

import { CountyAddressDTO } from 'esos-api';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';

export const organisationAddressFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [UntypedFormBuilder, ORGANISATION_ACCOUNT_STATE_PROVIDER],
  useFactory: (fb: UntypedFormBuilder, stateProvider: OrganisationAccountStateProvider) => {
    const address = stateProvider.address as CountyAddressDTO;
    return fb.group({
      addressDetails: fb.group({
        line1: [
          address?.line1 ?? null,
          [
            GovukValidators.required('Enter your line 1'),
            GovukValidators.maxLength(255, 'The line 1 should not be more than 255 characters'),
          ],
        ],
        line2: [
          address?.line2 ?? null,
          GovukValidators.maxLength(255, 'The line 2 should not be more than 255 characters'),
        ],
        city: [
          address?.city ?? null,
          [
            GovukValidators.required('Enter your town or city name'),
            GovukValidators.maxLength(255, 'The town or city name should not be more than 255 characters'),
          ],
        ],
        county: [address?.county ?? null, GovukValidators.required('Select your county')],
        postcode: [
          address?.postcode ?? null,
          [
            GovukValidators.required('Enter your postcode'),
            GovukValidators.maxLength(64, 'The postcode should not be more than 64 characters'),
          ],
        ],
      }),
    });
  },
};
