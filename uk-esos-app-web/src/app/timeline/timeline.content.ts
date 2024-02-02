import { RequestActionPageContentFactoryMap } from '@common/request-action/request-action.types';
import { notificationApplicationSentToEditContent } from '@timeline/notification/notification-application-content';
import {
  organisationAccountApplicationSubmittedContent,
  organisationAccountDecisionContent,
} from '@timeline/organisation-account-application/organisation-account-application-content';

export const timelineContent: RequestActionPageContentFactoryMap = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED: organisationAccountApplicationSubmittedContent,
  ORGANISATION_ACCOUNT_OPENING_APPROVED: organisationAccountDecisionContent,
  ORGANISATION_ACCOUNT_OPENING_REJECTED: organisationAccountDecisionContent,

  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT: notificationApplicationSentToEditContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED: notificationApplicationSentToEditContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT: notificationApplicationSentToEditContent,
};
