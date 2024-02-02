import { RequestCreateActionProcessDTO, RequestDetailsDTO } from 'esos-api';

export const processActionsDetailsTypesMap: Partial<Record<RequestDetailsDTO['requestType'], string>> = {
  ORGANISATION_ACCOUNT_OPENING: 'Account Creation',
  NOTIFICATION_OF_COMPLIANCE_P3: 'Notification of Compliance',
};

export interface WorkflowLabel {
  title: string;
  button: string;
  type: RequestCreateActionProcessDTO['requestCreateActionType'];
  errors: string[];
}

export type WorkflowMap = Omit<
  Record<RequestDetailsDTO['requestType'], Partial<WorkflowLabel>>,
  'SYSTEM_MESSAGE_NOTIFICATION'
>;
