import { FormControl, ValidatorFn } from '@angular/forms';

import { mapFieldsToColumnNames } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Validates a CSV field according to a regex pattern
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrPatternValidator(
  field: keyof OrganisationAssociatedWithRU,
  pattern: RegExp,
  message: string,
  optional = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (optional && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!pattern.test(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldOrgStrPattern' + field]: {
          rows: errorMessageRows,
          columns: mapFieldsToColumnNames([field]),
          message,
        },
      };
    }

    return null;
  };
}
