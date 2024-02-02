import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const totalEnergyConsumptionReductionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const totalEnergyConsumptionReduction = state()?.totalEnergyConsumptionReduction;

    return fb.group({
      totalEnergyConsumptionReduction: [
        totalEnergyConsumptionReduction ?? 0,
        [
          GovukValidators.required('Enter the total energy consumption'),
          GovukValidators.integerNumber('Total energy consumption must be an integer'),
          GovukValidators.positiveNumber('The total reduction in energy consumption must be more than 0 kWh'),
        ],
      ],
    });
  },
};
