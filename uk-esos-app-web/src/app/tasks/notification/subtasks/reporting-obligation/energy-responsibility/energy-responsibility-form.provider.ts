import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ReportingObligationDetails } from 'esos-api';

export type EnergyResponsibilityFormModel = {
  energyResponsibility: FormControl<ReportingObligationDetails['energyResponsibilityType']>;
};

export const energyResponsibilityFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const ro = store.select(notificationQuery.selectReportingObligation)();
    const er = ro?.reportingObligationDetails?.energyResponsibilityType;

    return fb.group<EnergyResponsibilityFormModel>({
      energyResponsibility: new FormControl(er ?? null, [GovukValidators.required('Select an option')]),
    });
  },
};
