import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { numberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedEstimateFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsEstimation = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsEstimation;

    return fb.group(
      {
        buildings: [energySavingsEstimation?.buildings ?? 0, numberValidators],
        transport: [energySavingsEstimation?.transport ?? 0, numberValidators],
        industrialProcesses: [energySavingsEstimation?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [energySavingsEstimation?.otherProcesses ?? 0, numberValidators],
      },
      { updateOn: 'change' },
    );
  },
};
