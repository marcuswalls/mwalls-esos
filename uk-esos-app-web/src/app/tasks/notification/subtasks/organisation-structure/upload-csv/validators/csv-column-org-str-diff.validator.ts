import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

/**
 * Validates a CSV file for its columns
 * Returns the column and row the error was found at
 */
export function csvColumnOrgStrDiffValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    const error = {
      ['csvColumnsOrgStrDiff']: {
        rows: null,
        columns: null,
        message: 'The header names cannot be different than the ones included in the template',
      },
    };

    if (!Array.isArray(data)) {
      return error;
    }

    const mapKeys = Object.keys(organisationStructureCsvMap);
    for (const key of mapKeys) {
      if (!data.includes(organisationStructureCsvMap[key])) {
        return error;
      }
    }

    return null;
  };
}
