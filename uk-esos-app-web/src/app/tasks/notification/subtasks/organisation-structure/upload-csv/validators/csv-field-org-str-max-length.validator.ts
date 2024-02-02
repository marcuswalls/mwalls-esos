import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Validates a CSV field for its length
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrMaxLengthValidator(
  field: keyof OrganisationAssociatedWithRU,
  length: number,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField && currentField?.length > length) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = organisationStructureCsvMap?.[field];
      return {
        ['csvFieldOrgStrMaxLength' + field]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' is too long (max characters 255)`,
        },
      };
    }

    return null;
  };
}
