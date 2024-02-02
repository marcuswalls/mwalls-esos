import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { getTotalKwhSum } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input';

import { GovukValidators } from 'govuk-components';

/**
 * Validates that the total of `energySavingsEstimation` is equal to the total of `energySavingsCategories`
 */
export const energySavingsTotalsEqualValidator = (estimatesTotalKWh: number): ValidatorFn => {
  return GovukValidators.builder(
    'The total annual reduction in energy consumption in kWh from alternative compliance routes across buildings, transport, industrial processes and other processes must equal the total annual reduction in energy consumption in kWh across the categories listed below.',
    (group: UntypedFormGroup) => {
      const energyManagementPractices = group.controls.energyManagementPractices;
      const behaviourChangeInterventions = group.controls.behaviourChangeInterventions;
      const training = group.controls.training;
      const controlsImprovements = group.controls.controlsImprovements;
      const shortTermCapitalInvestments = group.controls.shortTermCapitalInvestments;
      const longTermCapitalInvestments = group.controls.longTermCapitalInvestments;
      const otherMeasures = group.controls.otherMeasures;

      const total =
        +energyManagementPractices?.value +
        +behaviourChangeInterventions.value +
        +training.value +
        +controlsImprovements.value +
        +shortTermCapitalInvestments.value +
        +longTermCapitalInvestments.value +
        +otherMeasures.value;

      return total === estimatesTotalKWh ? null : { energySavingsTotalsNotEqual: true };
    },
  );
};

/**
 * Validates that the total of EnergySavingsCategories is greater than 0
 */
export function totalEnergySavingsCategoriesGreaterThanZeroValidator(): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    return getTotalKwhSum(group.value) == 0 ? { invalidTotal: 'Please provide a value of energy in KWh' } : null;
  };
}

export const energySavingsCategoriesFieldValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];
