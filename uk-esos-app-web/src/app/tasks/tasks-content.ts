import { RequestTaskPageContentFactoryMap } from '@common/request-task/request-task.types';
import { notificationTaskContent, waitForEditTaskContent } from '@tasks/notification/notification-task-content';
import { organisationAccountApplicationReviewTaskContent } from '@tasks/organisation-account-application-review/organisation-account-application-review-task-content';

export const tasksContent: RequestTaskPageContentFactoryMap = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW: organisationAccountApplicationReviewTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT: notificationTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT: notificationTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT: waitForEditTaskContent,
};
