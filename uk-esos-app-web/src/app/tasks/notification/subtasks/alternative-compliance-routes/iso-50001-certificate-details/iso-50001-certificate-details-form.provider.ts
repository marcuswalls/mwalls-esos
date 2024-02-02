import { Provider } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { addCertificateDetailsGroup } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TASK_FORM } from '@tasks/task-form.token';

export const iso50001CertificateDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const iso50001CertificateDetails = state()?.iso50001CertificateDetails;

    return addCertificateDetailsGroup('iso50001CertificateDetails', iso50001CertificateDetails);
  },
};
