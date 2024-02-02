import { FormControl, ValidatorFn } from '@angular/forms';

import { mapFieldsToColumnNames } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Validates a CSV field as unique across different rows
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrUniqueValidator(field: keyof OrganisationAssociatedWithRU, message: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const combinations = new Map<string, number[]>();

    data.forEach((entry, index) => {
      const key = entry?.[field];

      const existingRows = combinations.get(key);
      if (existingRows) {
        existingRows.push(index + 1);
      } else {
        combinations.set(key, [index + 1]);
      }
    });

    combinations.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((rowIndex) => {
          errorMessageRows.push({
            rowIndex: rowIndex,
          });
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldOrgStrUnique' + field]: {
          rows: errorMessageRows,
          columns: mapFieldsToColumnNames([field]),
          message,
        },
      };
    }

    return null;
  };
}
