import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const organisationDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectResponsibleUndertaking);
    const originatedOrganisationDetails = store.select(notificationQuery.selectAccountOriginatedData)()
      .organisationDetails;

    const organisationDetails = state()?.organisationDetails;

    return fb.group({
      name: [
        organisationDetails?.name ?? originatedOrganisationDetails?.name,
        [
          GovukValidators.required('Enter the registered name of the organisation'),
          GovukValidators.maxLength(255, 'The registered name should not be more than 255 characters'),
        ],
      ],
      registrationNumber: [
        organisationDetails?.registrationNumber ?? originatedOrganisationDetails?.registrationNumber,
        [GovukValidators.maxLength(255, 'The registration number should not be more than 255 characters')],
      ],
      ...CountyAddressInputComponent.controlsFactory(organisationDetails ?? originatedOrganisationDetails),
    });
  },
};
