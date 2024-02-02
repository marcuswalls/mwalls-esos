import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { WizardStep } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { isWizardCompleted } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.wizard-steps';

export const canActivateEnergyConsumption: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const energyConsumption = store.select(notificationQuery.selectEnergyConsumption)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(energyConsumption) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canActivateEnergyConsumptionSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const energyConsumption = store.select(notificationQuery.selectEnergyConsumption)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(energyConsumption)) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.TOTAL_ENERGY])
  );
};
