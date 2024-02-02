import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  energyConsumptionFieldValidators,
  totalValueValidatorGreaterThanZero,
} from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

export const energyConsumptionReductionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const energyConsumptionReduction = state()?.energyConsumptionReduction;

    return fb.group(
      {
        buildings: [energyConsumptionReduction?.buildings ?? 0, energyConsumptionFieldValidators],
        transport: [energyConsumptionReduction?.transport ?? 0, energyConsumptionFieldValidators],
        industrialProcesses: [energyConsumptionReduction?.industrialProcesses ?? 0, energyConsumptionFieldValidators],
        otherProcesses: [energyConsumptionReduction?.otherProcesses ?? 0, energyConsumptionFieldValidators],
      },
      { updateOn: 'change', validators: [totalValueValidatorGreaterThanZero()] },
    );
  },
};
