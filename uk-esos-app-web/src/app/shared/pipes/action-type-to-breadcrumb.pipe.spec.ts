import { ActionTypeToBreadcrumbPipe } from './action-type-to-breadcrumb.pipe';

const map = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED: 'Original application submitted',
  ORGANISATION_ACCOUNT_OPENING_APPROVED: 'Organisation account approved',
  ORGANISATION_ACCOUNT_OPENING_REJECTED: 'Organisation account rejected',

  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT: 'Notification sent for review',
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT: 'Notification returned',
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED: 'Notification submitted',
};

describe('ActionTypeToBreadcrumbPipe', () => {
  const pipe = new ActionTypeToBreadcrumbPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display correct breadcrumb per type', () => {
    Object.keys(map).forEach((type) => {
      expect(pipe.transform(type as any)).toEqual(map[type]);
    });
  });
});
