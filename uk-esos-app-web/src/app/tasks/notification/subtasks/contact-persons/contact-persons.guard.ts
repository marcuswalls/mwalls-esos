import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { ContactPersonsWizardStep } from './contact-persons.helper';
import { isWizardCompleted } from './contact-persons.wizard';

export const canActivateContactPersons: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || change || createUrlTreeFromSnapshot(route, [ContactPersonsWizardStep.SUMMARY]);
};

export const canActivateContactPersonsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const contactPersons = store.select(notificationQuery.selectContactPersons)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(contactPersons)) ||
    createUrlTreeFromSnapshot(route, ['./', ContactPersonsWizardStep.PRIMARY_CONTACT])
  );
};
