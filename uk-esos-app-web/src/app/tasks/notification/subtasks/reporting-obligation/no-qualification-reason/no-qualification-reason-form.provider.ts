import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export type NoQualificationReasonFormModel = {
  noQualificationReason: FormControl<string>;
};

export const noQualificationReasonFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();

    return fb.group<NoQualificationReasonFormModel>({
      noQualificationReason: new FormControl(ro?.noQualificationReason ?? null, [
        GovukValidators.required('Enter a reason'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
    });
  },
};
