import { SideEffect } from '@common/forms/side-effects';
import { ENERGY_CONSUMPTION_SUB_TASK } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class EnergyConsumptionSideEffect extends SideEffect {
  override subtask = ENERGY_CONSUMPTION_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const exists = payload?.noc?.energyConsumptionDetails?.significantEnergyConsumptionExists;
      const infoExists = payload?.noc?.energyConsumptionDetails?.additionalInformationExists;

      if (exists === false) {
        delete payload?.noc?.energyConsumptionDetails?.significantEnergyConsumption;
      }

      if (infoExists === false) {
        delete payload?.noc?.energyConsumptionDetails?.additionalInformation;
      }
    });
  }
}
