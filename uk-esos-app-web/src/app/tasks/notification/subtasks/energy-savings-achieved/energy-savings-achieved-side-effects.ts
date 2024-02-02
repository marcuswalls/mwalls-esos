import { SideEffect } from '@common/forms/side-effects/side-effect';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK } from './energy-savings-achieved.helper';

export class EnergySavingsAchievedSideEffect extends SideEffect {
  override subtask = ENERGY_SAVINGS_ACHIEVED_SUB_TASK;

  override apply(
    currentPayload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
  ): NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload {
    return produce(currentPayload, (payload) => {
      const energySavingsAchieved = this.store.select(notificationQuery.selectEnergySavingsAchieved)();

      if (energySavingsAchieved?.energySavingCategoriesExist === false) {
        delete payload?.noc?.energySavingsAchieved?.energySavingsCategories;
      }

      if (energySavingsAchieved?.energySavingsRecommendationsExist === false) {
        delete payload?.noc?.energySavingsAchieved?.energySavingsRecommendations;
      }
    });
  }
}
