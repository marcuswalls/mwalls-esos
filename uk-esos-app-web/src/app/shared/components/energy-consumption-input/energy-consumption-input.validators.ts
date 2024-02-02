import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

import { getSignificantPercentage, getTotalSum } from './energy-consumption-input';

export function totalValueValidatorGreaterThanZero(message?: string): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    return getTotalSum(group.value) == 0
      ? { invalidTotal: message ?? 'The organisational energy consumption must be equal to or greater than 0 kWh' }
      : null;
  };
}

export function percentageValueValidatorGreaterThan95(totalEnergyConsumption: number): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    const total = getTotalSum(group.value);
    const percentage = getSignificantPercentage(totalEnergyConsumption, total);

    return percentage < 95 || percentage > 100
      ? { invalidPercentage: 'The total significant energy consumption must be between 95% and 100%' }
      : null;
  };
}

export const energyConsumptionFieldValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];
