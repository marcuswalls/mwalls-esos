import { SideEffect } from '@common/forms/side-effects/side-effect';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { COMPLIANCE_ROUTE_SUB_TASK } from './compliance-route.helper';

export class ComplianceRouteSideEffect extends SideEffect {
  override subtask = COMPLIANCE_ROUTE_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const areDataEstimated = payload?.noc?.complianceRoute?.areDataEstimated;
      const energyConsumptionProfilingUsed = payload?.noc?.complianceRoute?.energyConsumptionProfilingUsed;
      const partsProhibitedFromDisclosingExist = payload?.noc?.complianceRoute?.partsProhibitedFromDisclosingExist;

      if (areDataEstimated === true) {
        delete payload?.noc?.complianceRoute?.twelveMonthsVerifiableDataUsed;
      } else if (areDataEstimated === false) {
        delete payload?.noc?.complianceRoute?.areEstimationMethodsRecordedInEvidencePack;
      }

      if (energyConsumptionProfilingUsed == 'YES') {
        delete payload?.noc?.complianceRoute?.energyAudits;
      } else if (['NO', 'NOT_APPLICABLE'].includes(energyConsumptionProfilingUsed)) {
        delete payload?.noc?.complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded;
      }

      if (partsProhibitedFromDisclosingExist === false) {
        delete payload?.noc?.complianceRoute?.partsProhibitedFromDisclosing;
        delete payload?.noc?.complianceRoute?.partsProhibitedFromDisclosingReason;
      }
    });
  }
}
