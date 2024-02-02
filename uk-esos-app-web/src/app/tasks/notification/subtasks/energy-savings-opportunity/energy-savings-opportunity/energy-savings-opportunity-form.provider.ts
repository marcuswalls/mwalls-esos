import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { numberValidators } from '../energy-savings-opportunity.validators';

export const energySavingsOpportunityFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energyConsumption = store.select(notificationQuery.selectEnergySavingsOpportunities)()?.energyConsumption;

    return fb.group(
      {
        buildings: [energyConsumption?.buildings ?? 0, numberValidators],
        transport: [energyConsumption?.transport ?? 0, numberValidators],
        industrialProcesses: [energyConsumption?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [energyConsumption?.otherProcesses ?? 0, numberValidators],
      },
      { updateOn: 'change' },
    );
  },
};
