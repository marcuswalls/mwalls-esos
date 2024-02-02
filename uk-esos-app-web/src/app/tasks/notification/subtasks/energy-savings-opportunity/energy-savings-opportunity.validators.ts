import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { getTotalKwhSum } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input';

import { GovukValidators } from 'govuk-components';

export const numberValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];

export function sumValidationEqualToOpportunity(totalEnergyConsumption?: number): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    const total = getTotalKwhSum(group.value);

    if (total === totalEnergyConsumption) {
      return null;
    } else {
      return {
        sumNotEqualToOpportunity:
          'The total estimate of the potential annual reduction in energy consumption in kWh across buildings, transport, industrial processes and other processes must equal the total estimate of the potential annual reduction in energy consumption in kWh across the categories listed below.',
      };
    }
  };
}
