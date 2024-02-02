import { Provider } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidatorFn } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const ReviewAssessmentDateFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const reviewAssessmentDate = state()?.reviewAssessmentDate;

    return fb.group({
      reviewAssessmentDate: [
        reviewAssessmentDate ? (new Date(reviewAssessmentDate) as any) : null,
        [GovukValidators.required('Select a date'), pastDateValidator()],
      ],
    });
  },
};

function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const dateAndTime = new Date();
    const today = new Date(dateAndTime.toDateString());
    if (control?.value && control?.value instanceof Date) {
      const inputDate = new Date(control?.value.toDateString());
      return inputDate >= today ? { invalidDate: `The date must be in the past` } : null;
    }
    return null;
  };
}
