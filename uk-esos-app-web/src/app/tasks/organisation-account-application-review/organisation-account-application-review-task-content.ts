import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';

import { OrganisationAccountApplicationReviewComponent } from './components/organisation-account-application-review';

export const organisationAccountApplicationReviewTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Review organisation account application',
    contentComponent: OrganisationAccountApplicationReviewComponent,
  };
};
