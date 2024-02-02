import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './confirmation.helper';

export const confirmationBacklinkResolver = (currentStepRoute: string) => {
  return () => {
    const store = inject(RequestTaskStore);
    const router = inject(Router);
    const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    if (isChangeClicked) {
      return WizardStep.STEP_SUMMARY;
    } else {
      switch (currentStepRoute) {
        case WizardStep.STEP_OFFICER_DETAILS:
          if (reportingObligationCategory !== 'ZERO_ENERGY') {
            return `../${WizardStep.STEP_ASSESSMENT_TYPES}`;
          } else {
            return `../${WizardStep.STEP_NO_ENERGY_ASSESSMENT_TYPES}`;
          }

        default:
          return WizardStep.STEP_SUMMARY;
      }
    }
  };
};
