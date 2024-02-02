import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { numberValidators, sumValidationEqualToOpportunity } from '../energy-savings-opportunity.validators';

export const energySavingsOpportunityCategoryFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energyConsumptionTotal = store.select(notificationQuery.selectEnergySavingsOpportunities)()?.energyConsumption
      .total;

    const energySavingsCategories = store.select(notificationQuery.selectEnergySavingsOpportunities)()
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
      {
        updateOn: 'change',
        validators: [sumValidationEqualToOpportunity(energyConsumptionTotal)],
      },
    );
  },
};
