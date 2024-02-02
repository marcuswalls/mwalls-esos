import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { numberValidators, oneHundredPercentTotalValidator } from '../energy-savings-achieved.validators';

export const energySavingsAchievedRecommendationsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsRecommendations = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsRecommendations;

    return fb.group(
      {
        energyAudits: [energySavingsRecommendations?.energyAudits ?? 0, numberValidators],
        alternativeComplianceRoutes: [energySavingsRecommendations?.alternativeComplianceRoutes ?? 0, numberValidators],
        other: [energySavingsRecommendations?.other ?? 0, numberValidators],
      },
      {
        updateOn: 'change',
        validators: [oneHundredPercentTotalValidator()],
      },
    );
  },
};
