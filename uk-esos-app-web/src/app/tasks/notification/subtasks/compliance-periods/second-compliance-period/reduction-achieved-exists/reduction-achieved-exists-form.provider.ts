import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const reductionAchievedExistsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const compliancePeriod = store.select(notificationQuery.selectSecondCompliancePeriod)();
    return fb.group({
      reductionAchievedExists: [
        compliancePeriod?.reductionAchievedExists,
        GovukValidators.required('Select yes if you have information on how much energy was saved'),
      ],
    });
  },
};
