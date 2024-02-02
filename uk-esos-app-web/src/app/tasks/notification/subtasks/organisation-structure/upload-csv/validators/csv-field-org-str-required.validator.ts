import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

import { OrganisationAssociatedWithRU } from 'esos-api';

/**
 * Validates a CSV field as required
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrRequiredValidator(field: keyof OrganisationAssociatedWithRU): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField === undefined || currentField === null || currentField?.length === 0) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = organisationStructureCsvMap?.[field];
      return {
        ['csvFieldOrgStrRequired' + field]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has invalid values`,
        },
      };
    }

    return null;
  };
}
