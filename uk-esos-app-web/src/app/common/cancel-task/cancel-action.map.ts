import { RequestTaskActionProcessDTO, RequestTaskDTO } from 'esos-api';

export const cancelActionMap: Partial<
  Record<RequestTaskDTO['type'], RequestTaskActionProcessDTO['requestTaskActionType']>
> = {};
