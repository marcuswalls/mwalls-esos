import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  percentageValueValidatorGreaterThan95,
  totalValueValidatorGreaterThanZero,
} from '@shared/components/energy-consumption-input/energy-consumption-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriod,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const significantEnergyConsumptionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, COMPLIANCE_PERIOD_SUB_TASK],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, subtask: CompliancePeriod) => {
    const compliancePeriod =
      subtask === CompliancePeriodSubtask.FIRST
        ? store.select(notificationQuery.selectFirstCompliancePeriod)()
        : store.select(notificationQuery.selectSecondCompliancePeriod)();
    const significantEnergyConsumption = compliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumption;
    const totalEnergyConsumption =
      compliancePeriod?.firstCompliancePeriodDetails?.organisationalEnergyConsumption.total;
    const numberValidators = [
      GovukValidators.required('Please provide a value of energy in KWh'),
      GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
      GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
    ];
    return fb.group(
      {
        buildings: [significantEnergyConsumption?.buildings ?? 0, numberValidators],
        transport: [significantEnergyConsumption?.transport ?? 0, numberValidators],
        industrialProcesses: [significantEnergyConsumption?.industrialProcesses ?? 0, numberValidators],
        otherProcesses: [significantEnergyConsumption?.otherProcesses ?? 0, numberValidators],
      },
      {
        validators: [totalValueValidatorGreaterThanZero, percentageValueValidatorGreaterThan95(totalEnergyConsumption)],
        updateOn: 'change',
      },
    );
  },
};
