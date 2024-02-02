import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { AssessmentPersonnelWizardStep } from './assessment-personnel.helper';
import { isWizardCompleted } from './assessment-personnel.wizard';

export const canActivateAssessmentPersonnel: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const change = route.queryParamMap.get('change') === 'true';

  return isEditable || change || createUrlTreeFromSnapshot(route, [AssessmentPersonnelWizardStep.SUMMARY]);
};

export const canAlterAssessmentPersonnel: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const assessmentPersonnel = store.select(notificationQuery.selectAssessmentPersonnel)();

  const canAlter =
    route.paramMap.get('personIndex') &&
    assessmentPersonnel.personnel.length &&
    !!assessmentPersonnel.personnel[route.paramMap.get('personIndex')];

  return (isEditable && canAlter) || createUrlTreeFromSnapshot(route, [`../../${AssessmentPersonnelWizardStep.STEP_LIST}`]);
};

export const canActivateAssessmentPersonnelSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const assessmentPersonnel = store.select(notificationQuery.selectAssessmentPersonnel)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(assessmentPersonnel)) ||
    createUrlTreeFromSnapshot(route, [AssessmentPersonnelWizardStep.STEP_LIST])
  );
};
