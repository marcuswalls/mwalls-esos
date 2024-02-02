import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { RequestActionPageContentFactory } from '@common/request-action/request-action.types';
import { ItemActionHeaderPipe } from '@shared/pipes/item-action-header.pipe';

import { OrganisationAccountApplicationSubmittedComponent, OrganisationAccountDecisionComponent } from './components';

export const organisationAccountApplicationSubmittedContent: RequestActionPageContentFactory = (injector) => {
  const pipe = new ItemActionHeaderPipe();
  const action = injector.get(RequestActionStore).select(requestActionQuery.selectAction)();

  return {
    header: pipe.transform(action),
    component: OrganisationAccountApplicationSubmittedComponent,
  };
};

export const organisationAccountDecisionContent: RequestActionPageContentFactory = (injector) => {
  const pipe = new ItemActionHeaderPipe();
  const action = injector.get(RequestActionStore).select(requestActionQuery.selectAction)();

  return {
    header: pipe.transform(action),
    component: OrganisationAccountDecisionComponent,
  };
};
