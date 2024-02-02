import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  energySavingsCategoriesFieldValidators,
  energySavingsTotalsEqualValidator,
  totalEnergySavingsCategoriesGreaterThanZeroValidator,
} from '@shared/components/energy-savings-categories-input/energy-savings-categories-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

export const energyConsumptionReductionCategoriesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const energyConsumptionReductionCategories = state()?.energyConsumptionReductionCategories;
    const totalEnergyConsumptionReduction = state()?.energyConsumptionReduction.total;

    return fb.group(
      {
        energyManagementPractices: [
          energyConsumptionReductionCategories?.energyManagementPractices ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
        behaviourChangeInterventions: [
          energyConsumptionReductionCategories?.behaviourChangeInterventions ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
        training: [energyConsumptionReductionCategories?.training ?? 0, energySavingsCategoriesFieldValidators],
        controlsImprovements: [
          energyConsumptionReductionCategories?.controlsImprovements ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
        shortTermCapitalInvestments: [
          energyConsumptionReductionCategories?.shortTermCapitalInvestments ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
        longTermCapitalInvestments: [
          energyConsumptionReductionCategories?.longTermCapitalInvestments ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
        otherMeasures: [
          energyConsumptionReductionCategories?.otherMeasures ?? 0,
          energySavingsCategoriesFieldValidators,
        ],
      },
      {
        updateOn: 'change',
        validators: [
          totalEnergySavingsCategoriesGreaterThanZeroValidator(),
          energySavingsTotalsEqualValidator(totalEnergyConsumptionReduction),
        ],
      },
    );
  },
};
