import { Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  maxFileSizeValidator,
} from '@shared/validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';
import {
  csvColumnOrgStrDiffValidator,
  csvColumnOrgStrNumberValidator,
  csvFieldOrgStrBooleanValidator,
  csvFieldOrgStrMaxLengthValidator,
  csvFieldOrgStrPatternValidator,
  csvFieldOrgStrRequiredValidator,
} from '@tasks/notification/subtasks/organisation-structure/upload-csv/validators';
import { csvFieldOrgStrRegistrationNumberValidator } from '@tasks/notification/subtasks/organisation-structure/upload-csv/validators/csv-field-org-str-registration-number.validator';
import { csvFieldOrgStrUniqueValidator } from '@tasks/notification/subtasks/organisation-structure/upload-csv/validators/csv-field-org-str-unique.validator';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationAssociatedWithRU } from 'esos-api';

export interface OrganisationsAssociatedWithRUFormModel {
  organisationName: FormControl<string | null>;
  registrationNumber: FormControl<string | null>;
  isCoveredByThisNotification: FormControl<boolean | null>;
  isPartOfArrangement: FormControl<boolean | null>;
  isParentOfResponsibleUndertaking: FormControl<boolean | null>;
  isSubsidiaryOfResponsibleUndertaking: FormControl<boolean | null>;
  isPartOfFranchise: FormControl<boolean | null>;
  isTrust: FormControl<boolean | null>;
  hasCeasedToBePartOfGroup: FormControl<boolean | null>;
}

export type OrganisationsRUFormArray = FormArray<FormGroup<OrganisationsAssociatedWithRUFormModel>>;

export interface UploadCSVFormModel {
  organisationsRU: OrganisationsRUFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

export const uploadCsvFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const registrationNumberRU = store.select(notificationQuery.selectResponsibleUndertaking)()?.organisationDetails
      .registrationNumber;

    return fb.group<UploadCSVFormModel>({
      organisationsRU: fb.array([] as FormGroup<OrganisationsAssociatedWithRUFormModel>[], {
        updateOn: 'change',
        validators: uploadCSVFormValidators(registrationNumberRU),
      }),
      columns: fb.control(null, {
        updateOn: 'change',
        validators: [csvColumnOrgStrNumberValidator(), csvColumnOrgStrDiffValidator()],
      }),
      file: fb.control(null, {
        updateOn: 'change',
        validators: [
          fileExtensionValidator(['csv'], ['text/csv', 'application/vnd.ms-excel'], 'The selected file must be a CSV'),
          maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
          fileNameLengthValidator(100, 'The selected file must must have a file name length less than 100 characters'),
          emptyFileValidator('The selected file cannot be empty'),
        ],
      }),
    });
  },
};

export const addOrganisationRUGroup = (
  organisationAssociatedWithRU: OrganisationAssociatedWithRU,
): FormGroup<OrganisationsAssociatedWithRUFormModel> => {
  return new FormGroup<OrganisationsAssociatedWithRUFormModel>({
    organisationName: new FormControl<string | null>(organisationAssociatedWithRU?.organisationName ?? null),
    registrationNumber: new FormControl<string | null>(organisationAssociatedWithRU?.registrationNumber ?? null),
    isCoveredByThisNotification: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.isCoveredByThisNotification ?? null,
    ),
    isPartOfArrangement: new FormControl<boolean | null>(organisationAssociatedWithRU?.isPartOfArrangement ?? null),
    isParentOfResponsibleUndertaking: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.isParentOfResponsibleUndertaking ?? null,
    ),
    isSubsidiaryOfResponsibleUndertaking: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.isSubsidiaryOfResponsibleUndertaking ?? null,
    ),
    isPartOfFranchise: new FormControl<boolean | null>(organisationAssociatedWithRU?.isPartOfFranchise ?? null),
    isTrust: new FormControl<boolean | null>(organisationAssociatedWithRU?.isTrust ?? null),
    hasCeasedToBePartOfGroup: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.hasCeasedToBePartOfGroup ?? null,
    ),
  });
};

export const uploadCSVFormValidators = (registrationNumberRU: string) => [
  GovukValidators.required('Upload a CSV file'),

  csvFieldOrgStrRequiredValidator('organisationName'),
  csvFieldOrgStrMaxLengthValidator('organisationName', 255),

  csvFieldOrgStrPatternValidator(
    'registrationNumber',
    new RegExp('^[a-zA-Z]{1}\\d{7}$|^[a-zA-Z]{2}\\d{6}$'),
    `The field '${organisationStructureCsvMap.registrationNumber}' must be 8 digits, either 1 letter followed by 7 digits or 2 letters followed by 6 digits. If your Company Registration Number has less than 8 digits then you may need to add zeros at the beginning.`,
  ),
  csvFieldOrgStrUniqueValidator(
    'registrationNumber',
    'There are duplicated organisation registration numbers in the file',
  ),
  csvFieldOrgStrRegistrationNumberValidator(
    'registrationNumber',
    registrationNumberRU,
    'There is an organisation with the same registration number as the one of the responsible undertaking',
  ),

  csvFieldOrgStrBooleanValidator('isCoveredByThisNotification'),
  csvFieldOrgStrBooleanValidator('isPartOfArrangement'),
  csvFieldOrgStrBooleanValidator('isParentOfResponsibleUndertaking'),
  csvFieldOrgStrBooleanValidator('isSubsidiaryOfResponsibleUndertaking'),
  csvFieldOrgStrBooleanValidator('isPartOfFranchise'),
  csvFieldOrgStrBooleanValidator('isTrust'),
  csvFieldOrgStrBooleanValidator('hasCeasedToBePartOfGroup'),
];
