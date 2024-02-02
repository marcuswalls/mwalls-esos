import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { energySavingsTotalsEqualValidator } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { numberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedCategoriesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const estimatesTotalkWh = store.select(notificationQuery.selectEnergySavingsAchieved)().energySavingsEstimation
      .total;

    const energySavingsCategories = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsCategories;

    return fb.group(
      {
        energyManagementPractices: [energySavingsCategories?.energyManagementPractices ?? 0, numberValidators],
        behaviourChangeInterventions: [energySavingsCategories?.behaviourChangeInterventions ?? 0, numberValidators],
        training: [energySavingsCategories?.training ?? 0, numberValidators],
        controlsImprovements: [energySavingsCategories?.controlsImprovements ?? 0, numberValidators],
        shortTermCapitalInvestments: [energySavingsCategories?.shortTermCapitalInvestments ?? 0, numberValidators],
        longTermCapitalInvestments: [energySavingsCategories?.longTermCapitalInvestments ?? 0, numberValidators],
        otherMeasures: [energySavingsCategories?.otherMeasures ?? 0, numberValidators],
      },
      { updateOn: 'change', validators: [energySavingsTotalsEqualValidator(estimatesTotalkWh)] },
    );
  },
};
