import { RequestCreateActionEmptyPayload, RequestCreateActionProcessDTO } from 'esos-api';

export const requestCreateActionTypeLabelMap: Partial<
  Record<RequestCreateActionProcessDTO['requestCreateActionType'], string>
> = {};

export function createRequestCreateActionProcessDTO(
  requestCreateActionType: RequestCreateActionProcessDTO['requestCreateActionType'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestId: string,
): RequestCreateActionProcessDTO {
  switch (requestCreateActionType) {
    default:
      return {
        requestCreateActionType,
        requestCreateActionPayload: {
          payloadType: 'EMPTY_PAYLOAD',
        } as RequestCreateActionEmptyPayload,
      };
  }
}
