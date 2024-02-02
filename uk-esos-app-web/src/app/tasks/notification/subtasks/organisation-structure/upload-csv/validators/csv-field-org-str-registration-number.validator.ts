import { FormControl, ValidatorFn } from '@angular/forms';

import { mapFieldsToColumnNames } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Validates a CSV field as required
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrRegistrationNumberValidator(
  field: keyof OrganisationAssociatedWithRU,
  registrationNumberRU: string,
  message: string,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField === registrationNumberRU) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldOrgStrRegistrationNumber' + field]: {
          rows: errorMessageRows,
          columns: mapFieldsToColumnNames([field]),
          message,
        },
      };
    }

    return null;
  };
}
