import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const energyConsumptionProfilingMethodsRecordedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const areEnergyConsumptionProfilingMethodsRecorded = store.select(notificationQuery.selectComplianceRoute)()
      ?.areEnergyConsumptionProfilingMethodsRecorded;

    return fb.group({
      areEnergyConsumptionProfilingMethodsRecorded: [
        areEnergyConsumptionProfilingMethodsRecorded,
        GovukValidators.required('Select an option'),
      ],
    });
  },
};
