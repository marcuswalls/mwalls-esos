import { SideEffect } from '@common/forms/side-effects/side-effect';
import { RESPONSIBLE_UNDERTAKING_SUB_TASK } from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class ResponsibleUndertakingSideEffect extends SideEffect {
  override subtask = RESPONSIBLE_UNDERTAKING_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const hasOverseasParentDetails = payload?.noc?.responsibleUndertaking?.hasOverseasParentDetails;
      if (hasOverseasParentDetails === false) {
        delete payload?.noc?.responsibleUndertaking?.overseasParentDetails;
      }
    });
  }
}
