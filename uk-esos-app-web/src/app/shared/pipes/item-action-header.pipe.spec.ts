import { RequestActionDTO } from 'esos-api';

import { ItemActionHeaderPipe } from './item-action-header.pipe';

describe('ItemActionHeaderPipe', () => {
  let pipe: ItemActionHeaderPipe;

  const baseRequestAction: Omit<RequestActionDTO, 'type'> = {
    id: 1,
    payload: {},
    submitter: 'John Bolt',
    creationDate: '2021-03-29T12:26:36.000Z',
  };

  beforeAll(() => (pipe = new ItemActionHeaderPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the organisation accounts', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Original application submitted by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_APPROVED',
      }),
    ).toEqual('Organisation account approved by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_REJECTED',
      }),
    ).toEqual('Organisation account rejected by John Bolt');
  });

  it('should return the notifications', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT',
      }),
    ).toEqual('Notification sent for review by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT',
      }),
    ).toEqual('Notification returned by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Notification submitted by John Bolt');
  });

  it('should return the payments', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_MARKED_AS_PAID',
      }),
    ).toEqual('Payment marked as paid by John Bolt (BACS)');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_CANCELLED',
      }),
    ).toEqual('Payment task cancelled by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_MARKED_AS_RECEIVED',
      }),
    ).toEqual('Payment marked as received by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_COMPLETED',
      }),
    ).toEqual('Payment confirmed via GOV.UK pay');
  });

  it('should display the approved application title', () => {
    expect(pipe.transform({})).toEqual('Approved Application');
  });
});
