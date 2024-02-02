import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  percentageValueValidatorGreaterThan95,
  totalValueValidatorGreaterThanZero,
} from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  numberValidators,
  valueDependentValidators,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.validators';
import { TASK_FORM } from '@tasks/task-form.token';

export const significantEnergyFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const totalEnergyConsumption = store.select(notificationQuery.selectEnergyConsumption)()?.totalEnergyConsumption;
    const significantEnergyConsumption = store.select(notificationQuery.selectEnergyConsumption)()
      ?.significantEnergyConsumption;

    return fb.group(
      {
        buildings: [
          significantEnergyConsumption?.buildings ?? 0,
          [...numberValidators, ...valueDependentValidators(totalEnergyConsumption.buildings)],
        ],
        transport: [
          significantEnergyConsumption?.transport ?? 0,
          [...numberValidators, ...valueDependentValidators(totalEnergyConsumption.transport)],
        ],
        industrialProcesses: [
          significantEnergyConsumption?.industrialProcesses ?? 0,
          [...numberValidators, ...valueDependentValidators(totalEnergyConsumption.industrialProcesses)],
        ],
        otherProcesses: [
          significantEnergyConsumption?.otherProcesses ?? 0,
          [...numberValidators, ...valueDependentValidators(totalEnergyConsumption.otherProcesses)],
        ],
      },
      {
        validators: [
          percentageValueValidatorGreaterThan95(totalEnergyConsumption.total),
          totalValueValidatorGreaterThanZero('Enter a value of energy in KWh'),
        ],
        updateOn: 'change',
      },
    );
  },
};
