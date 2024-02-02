import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { totalValueValidatorGreaterThanZero } from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { numberValidators } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.validators';
import { TASK_FORM } from '@tasks/task-form.token';

export const totalEnergyFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const totalEnergyConsumption = store.select(notificationQuery.selectEnergyConsumption)()?.totalEnergyConsumption;

    return fb.group(
      {
        buildings: [totalEnergyConsumption?.buildings ?? 0, numberValidators],
        transport: [totalEnergyConsumption?.transport ?? 0, numberValidators],
        industrialProcesses: [totalEnergyConsumption?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [totalEnergyConsumption?.otherProcesses ?? 0, numberValidators],
      },
      {
        validators: totalValueValidatorGreaterThanZero('Enter a value of energy in KWh'),
        updateOn: 'change',
      },
    );
  },
};
