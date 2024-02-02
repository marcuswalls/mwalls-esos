import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { addCertificateDetailsGroup } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TASK_FORM } from '@tasks/task-form.token';

export const gdaCertificatesDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const gdaCertificatesDetails = state()?.gdaCertificatesDetails;

    /**
     * Map existing CertificateDetails[] to FormArray.
     * If none found create at least one FormGroup in FormArray
     */
    const certificatesDetailsFormGroups = gdaCertificatesDetails?.certificateDetails
      ? gdaCertificatesDetails?.certificateDetails?.map((certificateDetail) =>
          addCertificateDetailsGroup('gdaCertificatesDetails', certificateDetail),
        )
      : [addCertificateDetailsGroup('gdaCertificatesDetails')];

    return fb.group({
      certificateDetails: fb.array(certificatesDetailsFormGroups),
    });
  },
};
