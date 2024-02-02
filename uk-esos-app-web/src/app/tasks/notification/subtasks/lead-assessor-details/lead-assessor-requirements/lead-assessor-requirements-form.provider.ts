import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { GovukValidators } from 'govuk-components';

export const LeadAssessorRequirementsFormProvider: Provider = {
  provide: REQUEST_TASK_PAGE_CONTENT,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectLeadAssessor);
    const hasLeadAssessorConfirmation = state()?.hasLeadAssessorConfirmation;

    return fb.group({
      hasLeadAssessorConfirmation: [
        hasLeadAssessorConfirmation ?? null,
        [GovukValidators.required('Select an option')],
      ],
    });
  },
};
