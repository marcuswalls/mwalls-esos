import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

export const responsibleUndertakingDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const organisationStructure =
      store.select(notificationQuery.selectOrganisationStructure)() ?? ({} as OrganisationStructure);

    return fb.group({
      isPartOfArrangement: [
        organisationStructure.isPartOfArrangement,
        GovukValidators.required(
          'Select yes if the responsible undertaking has 2 or more parent groups complying as 1 participant',
        ),
      ],
      isPartOfFranchise: [
        organisationStructure.isPartOfFranchise,
        GovukValidators.required('Select yes if the responsible undertaking is part of a franchise group'),
      ],
      isTrust: [
        organisationStructure.isTrust,
        GovukValidators.required('Select yes if the responsible undertaking is a trust'),
      ],
      hasCeasedToBePartOfGroup: [
        organisationStructure.hasCeasedToBePartOfGroup,
        GovukValidators.required(
          'Select yes if the responsible undertaking ceased to be part of the corporate group between 31 December 2022 and 5 June 2024',
        ),
      ],
    });
  },
};
