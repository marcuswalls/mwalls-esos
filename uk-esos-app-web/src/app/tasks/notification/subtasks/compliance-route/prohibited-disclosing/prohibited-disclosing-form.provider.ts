import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const prohibitedDisclosingFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const partsProhibitedFromDisclosingExist = store.select(notificationQuery.selectComplianceRoute)()
      ?.partsProhibitedFromDisclosingExist;

    return fb.group({
      partsProhibitedFromDisclosingExist: [
        partsProhibitedFromDisclosingExist,
        GovukValidators.required('Select an option'),
      ],
    });
  },
};
