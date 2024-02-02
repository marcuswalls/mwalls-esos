import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

/**
 * Validates a CSV file for its columns
 * Returns the column and row the error was found at
 */
export function csvColumnOrgStrNumberValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    const mapKeys = Object.keys(organisationStructureCsvMap);

    if (data?.length !== mapKeys.length) {
      return {
        ['csvColumnsOrgStrNumber']: {
          rows: null,
          columns: null,
          message: `The file should include ${mapKeys.length} columns`,
        },
      };
    }

    return null;
  };
}
