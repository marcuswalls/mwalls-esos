import { SideEffect } from '@common/forms/side-effects/side-effect';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { LEAD_ASSESSOR_DETAILS_SUB_TASK } from './lead-assessor-details.helper';

export class LeadAssessorDetailsSideEffect extends SideEffect {
  override subtask = LEAD_ASSESSOR_DETAILS_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const leadAssessorType = payload?.noc?.leadAssessor?.leadAssessorType;

      if (leadAssessorType === 'EXTERNAL') {
        delete payload?.noc?.confirmations?.secondResponsibleOfficerEnergyTypes;
        delete payload?.noc?.confirmations?.secondResponsibleOfficerDetails;
      }
    });
  }
}
