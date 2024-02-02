import { SideEffect } from '@common/forms/side-effects/side-effect';
import { SUB_TASK_SECOND_COMPLIANCE_PERIOD } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class SecondCompliancePeriodSideEffect extends SideEffect {
  override subtask = SUB_TASK_SECOND_COMPLIANCE_PERIOD;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const informationExists = payload?.noc?.secondCompliancePeriod.informationExists;
      if (informationExists === false) {
        delete payload?.noc?.secondCompliancePeriod?.firstCompliancePeriodDetails;
        delete payload?.noc?.secondCompliancePeriod?.reductionAchievedExists;
        delete payload?.noc?.secondCompliancePeriod?.reductionAchieved;
      }
      const significantEnergyConsumptionExists =
        payload?.noc?.secondCompliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumptionExists;
      if (significantEnergyConsumptionExists === false) {
        delete payload?.noc?.secondCompliancePeriod?.firstCompliancePeriodDetails?.significantEnergyConsumption;
      }
      const potentialReductionExists =
        payload?.noc?.secondCompliancePeriod?.firstCompliancePeriodDetails?.potentialReductionExists;
      if (potentialReductionExists === false) {
        delete payload?.noc?.secondCompliancePeriod?.firstCompliancePeriodDetails?.potentialReduction;
      }
      const reductionAchievedExists = payload?.noc?.secondCompliancePeriod?.reductionAchievedExists;
      if (reductionAchievedExists === false) {
        delete payload?.noc?.secondCompliancePeriod?.reductionAchieved;
      }
    });
  }
}
