import { SideEffect } from '@common/forms/side-effects/side-effect';
import { SUB_TASK_FIRST_COMPLIANCE_PERIOD } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class FirstCompliancePeriodSideEffect extends SideEffect {
  override subtask = SUB_TASK_FIRST_COMPLIANCE_PERIOD;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const informationExists = payload?.noc?.firstCompliancePeriod.informationExists;
      if (informationExists === false) {
        delete payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails;
      }

      const significantEnergyConsumptionExists =
        payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumptionExists;
      if (significantEnergyConsumptionExists === false) {
        delete payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumption;
      }

      const potentialReductionExists =
        payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails?.potentialReductionExists;
      if (potentialReductionExists === false) {
        delete payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails?.potentialReduction;
      }
    });
  }
}
