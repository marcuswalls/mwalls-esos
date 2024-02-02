import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const addSecondaryContactFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const hasSecondaryContact = store.select(notificationQuery.selectContactPersons)().hasSecondaryContact;

    return fb.group({
      hasSecondaryContact: [
        hasSecondaryContact,
        GovukValidators.required('Select yes if you want to add a secondary contact'),
      ],
    });
  },
};
