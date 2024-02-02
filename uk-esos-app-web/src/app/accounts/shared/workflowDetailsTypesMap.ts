import { RequestDetailsDTO } from 'esos-api';

export const workflowDetailsTypesMap: Partial<Record<RequestDetailsDTO['requestType'], string>> = {
  ORGANISATION_ACCOUNT_OPENING: 'Account Creation',
  NOTIFICATION_OF_COMPLIANCE_P3: 'P3 Notification of compliance',
};
