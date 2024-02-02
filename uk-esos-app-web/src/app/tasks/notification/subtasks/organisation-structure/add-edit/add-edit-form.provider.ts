import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationAssociatedWithRU } from 'esos-api';

export const addEditFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, ActivatedRoute, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, route: ActivatedRoute, store: RequestTaskStore) => {
    let editOrganisation: OrganisationAssociatedWithRU;
    const index = +route.snapshot.params.index;

    if (index) {
      editOrganisation = store
        .select(notificationQuery.selectOrganisationStructure)()
        .organisationsAssociatedWithRU.find((_, i) => i === index - 1);
    }

    return fb.group({
      registrationNumber: [
        editOrganisation?.registrationNumber ?? null,
        GovukValidators.maxLength(255, 'Registration number should not be larger than 255 characters'),
      ],
      organisationName: [
        editOrganisation?.organisationName ?? null,
        [
          GovukValidators.required('Enter the organisation name'),
          GovukValidators.maxLength(255, 'Organisation number should not be larger than 255 characters'),
        ],
      ],
      taxReferenceNumber: [
        editOrganisation?.taxReferenceNumber ?? null,
        GovukValidators.maxLength(255, 'Reference number should not be larger than 255 characters'),
      ],
      isCoveredByThisNotification: [
        editOrganisation?.isCoveredByThisNotification ?? null,
        GovukValidators.required('Select yes if this organisation is covered in the notification'),
      ],
      isPartOfArrangement: [
        editOrganisation?.isPartOfArrangement ?? null,
        GovukValidators.required('Select yes if 2 or more parent groups are complying as one participant'),
      ],
      isParentOfResponsibleUndertaking: [
        editOrganisation?.isParentOfResponsibleUndertaking ?? null,
        GovukValidators.required('Select yes if the organisation is a parent of the responsible undertaking'),
      ],
      isSubsidiaryOfResponsibleUndertaking: [
        editOrganisation?.isSubsidiaryOfResponsibleUndertaking ?? null,
        GovukValidators.required('Select yes if the organisation is a subsidiary of the responsible undertaking'),
      ],
      isPartOfFranchise: [
        editOrganisation?.isPartOfFranchise ?? null,
        GovukValidators.required('Select yes if the organisation is part of a franchise group'),
      ],
      isTrust: [
        editOrganisation?.isTrust ?? null,
        GovukValidators.required('Select yes if this organisation is a trust'),
      ],
      hasCeasedToBePartOfGroup: [
        editOrganisation?.hasCeasedToBePartOfGroup ?? null,
        GovukValidators.required(
          'Select yes if this organisation was not part of the corporate group during the compliance period',
        ),
      ],
    });
  },
};
