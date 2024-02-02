import { Provider } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

export const ResponsibilityAssessmentTypesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const responsibilityAssessmentTypes = state()?.responsibilityAssessmentTypes;

    return fb.group({
      responsibilityAssessmentTypes: [responsibilityAssessmentTypes ?? null, allCheckedValidator(5)],
    });
  },
};

export function allCheckedValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return length !== control?.value?.length ? { notAllChecked: 'Select all declaration notes' } : null;
  };
}
