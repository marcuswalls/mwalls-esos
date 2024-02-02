import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const energyConsumptionProfilingFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energyConsumptionProfilingUsed = store.select(notificationQuery.selectComplianceRoute)()
      ?.energyConsumptionProfilingUsed;

    return fb.group({
      energyConsumptionProfilingUsed: [energyConsumptionProfilingUsed, GovukValidators.required('Select an option')],
    });
  },
};
