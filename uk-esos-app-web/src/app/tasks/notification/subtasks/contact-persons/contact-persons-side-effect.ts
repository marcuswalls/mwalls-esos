import { SideEffect } from '@common/forms/side-effects';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { CONTACT_PERSONS_SUB_TASK } from './contact-persons.helper';

export class ContactPersonsSideEffect extends SideEffect {
  override subtask = CONTACT_PERSONS_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const hasSecondaryContact = payload?.noc?.contactPersons?.hasSecondaryContact;

      if (hasSecondaryContact === false) {
        delete payload?.noc?.contactPersons?.secondaryContact;
      }
    });
  }
}
