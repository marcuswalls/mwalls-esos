import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const dataEstimatedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const areDataEstimated = store.select(notificationQuery.selectComplianceRoute)()?.areDataEstimated;

    return fb.group({
      areDataEstimated: [areDataEstimated, GovukValidators.required('Select an option')],
    });
  },
};
