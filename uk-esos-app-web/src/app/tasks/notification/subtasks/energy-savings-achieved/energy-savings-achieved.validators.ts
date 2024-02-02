import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

/**
 * Validates that all `energySavingsRecommendatios` values result in 100% total
 */
export const oneHundredPercentTotalValidator = (): ValidatorFn => {
  return GovukValidators.builder(
    'The total combined breakdown of energy savings achieved must be 100%',
    (group: UntypedFormGroup) => {
      const energyAudits = group.controls.energyAudits;
      const alternativeComplianceRoutes = group.controls.alternativeComplianceRoutes;
      const other = group.controls.other;
      const total = energyAudits?.value + alternativeComplianceRoutes.value + other.value;

      return total === 100 ? null : { oneHundredPercentTotalRequired: true };
    },
  );
};

export const numberValidators = [
  GovukValidators.required('Enter a number greater than or equal to 0'),
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];

export const numberValidatorsTotal = [
  GovukValidators.required('The estimate of total energy consumption must be equal to or greater than 0 kWh'),
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];
