import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { totalValueValidatorGreaterThanZero } from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriod,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const organisationalEnergyConsumptionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, COMPLIANCE_PERIOD_SUB_TASK],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, subtask: CompliancePeriod) => {
    const compliancePeriod =
      subtask === CompliancePeriodSubtask.FIRST
        ? store.select(notificationQuery.selectFirstCompliancePeriod)()
        : store.select(notificationQuery.selectSecondCompliancePeriod)();
    const numberValidators = [
      GovukValidators.required('Please provide a value of energy in KWh'),
      GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
      GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
    ];
    const organisationalEnergyConsumption =
      compliancePeriod?.firstCompliancePeriodDetails?.organisationalEnergyConsumption;
    return fb.group(
      {
        buildings: [organisationalEnergyConsumption?.buildings ?? 0, numberValidators],
        transport: [organisationalEnergyConsumption?.transport ?? 0, numberValidators],
        industrialProcesses: [organisationalEnergyConsumption?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [organisationalEnergyConsumption?.otherProcesses ?? 0, numberValidators],
      },
      { validators: totalValueValidatorGreaterThanZero(), updateOn: 'change' },
    );
  },
};
