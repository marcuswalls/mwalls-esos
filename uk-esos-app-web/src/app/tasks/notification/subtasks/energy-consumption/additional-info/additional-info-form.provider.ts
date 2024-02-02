import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const additionalInfoFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const additionalInformationExists = store.select(notificationQuery.selectEnergyConsumption)()
      ?.additionalInformationExists;
    const additionalInformation = store.select(notificationQuery.selectEnergyConsumption)()?.additionalInformation;

    return fb.group(
      {
        additionalInformationExists: [
          additionalInformationExists ?? null,
          GovukValidators.required('Please select Yes or No'),
        ],
        additionalInformation: [
          additionalInformation ?? null,
          [
            GovukValidators.required('Please provide additional information'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        ],
      },
      { updateOn: 'change' },
    );
  },
};
