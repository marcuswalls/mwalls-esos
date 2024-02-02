import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const energySavingsAchievedDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();

    return fb.group({
      details: [energySavingsAchieved?.details, [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')]],
    });
  },
};
