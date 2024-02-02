import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { totalValueValidatorGreaterThanZero } from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const reductionAchievedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const compliancePeriod = store.select(notificationQuery.selectSecondCompliancePeriod)();
    const energyConsumptionReductionAchieved = compliancePeriod?.reductionAchieved;
    const numberValidators = [
      GovukValidators.required('Please provide a value of energy in KWh'),
      GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
      GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
    ];
    return fb.group(
      {
        buildings: [energyConsumptionReductionAchieved?.buildings ?? 0, numberValidators],
        transport: [energyConsumptionReductionAchieved?.transport ?? 0, numberValidators],
        industrialProcesses: [energyConsumptionReductionAchieved?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [energyConsumptionReductionAchieved?.otherProcesses ?? 0, numberValidators],
      },
      { validators: totalValueValidatorGreaterThanZero(), updateOn: 'change' },
    );
  },
};
