import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isAfter } from 'date-fns';

/**
 * Validates that the "validUntil" date is later than the "validFrom" date
 */
export const validUntilLaterThanValidFromValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    const validFromDate = new Date(group.get('validFrom').value);
    const validUntilDate = new Date(group.get('validUntil').value);

    return isAfter(validUntilDate, validFromDate)
      ? null
      : {
          invalidDate: `Valid until date must be later than valid from date`,
        };
  };
};
