import { RequestInfoDTO, RequestTaskActionProcessDTO } from 'esos-api';

const relatedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']> = [
  'RFI_SUBMIT',
  'RDE_SUBMIT',
  'RFI_CANCEL',
];

export function hasRequestTaskAllowedActions(
  allowedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>,
) {
  return allowedRequestTaskActions?.some((action) => relatedRequestTaskActions.includes(action));
}

export function requestTaskAllowedActions(
  allowedRequestTaskActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>,
  taskId: number,
  isWorkflow?: boolean,
  requestInfo?: RequestInfoDTO,
) {
  return (
    allowedRequestTaskActions
      ?.filter((action) => relatedRequestTaskActions.includes(action))
      .map((action) => actionDetails(action, taskId, isWorkflow ? './' : '/', requestInfo)) ?? []
  );
}

function actionDetails(
  action: RequestTaskActionProcessDTO['requestTaskActionType'],
  taskId: number,
  routerLooks?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestInfo?: RequestInfoDTO,
) {
  switch (action) {
    case 'RFI_SUBMIT':
      return { text: 'Request for information', link: [routerLooks + 'rfi', taskId, 'questions'] };
    case 'RDE_SUBMIT':
      return {
        text: 'Request deadline extension',
        link: [routerLooks + 'rde', taskId, 'extend-determination'],
      };
    case 'RFI_CANCEL':
      return { text: 'Cancel request', link: [routerLooks + 'rfi', taskId, 'cancel-verify'] };

    default:
      return null;
  }
}
