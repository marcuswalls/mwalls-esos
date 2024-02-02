import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ReportingObligation } from 'esos-api';

import { notificationQuery } from '../../../+state/notification.selectors';

export type QualificationTypeFormModel = {
  qualificationType: FormControl<ReportingObligation['qualificationType']>;
};

export const qualificationTypeFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();

    return fb.group<QualificationTypeFormModel>({
      qualificationType: new FormControl(ro?.qualificationType ?? null, [GovukValidators.required('Select an option')]),
    });
  },
};
