import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ReportingObligationDetails } from 'esos-api';

import { notificationQuery } from '../../../+state/notification.selectors';

export type QualificationReasonsFormModel = {
  qualificationReasons: FormControl<ReportingObligationDetails['qualificationReasonTypes']>;
};

export const qualificationReasonsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();

    return fb.group<QualificationReasonsFormModel>(
      {
        qualificationReasons: new FormControl(ro?.reportingObligationDetails?.qualificationReasonTypes ?? [], [
          GovukValidators.required('Select at least one reason'),
        ]),
      },
      { updateOn: 'change' },
    );
  },
};
