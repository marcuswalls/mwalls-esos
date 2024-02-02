import { TaskTypeToBreadcrumbPipe } from './task-type-to-breadcrumb.pipe';

describe('TaskTypeToBreadcrumbPipe', () => {
  const pipe = new TaskTypeToBreadcrumbPipe();

  it('should map task types to item names', () => {
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW')).toEqual(
      'Review organisation account application',
    );

    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT')).toEqual('Submit notification');
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT')).toEqual('Review Phase 3 notification');
    expect(pipe.transform('NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT')).toEqual(
      'Awaiting review of Phase 3 notification',
    );

    expect(pipe.transform(null)).toBeNull();
  });
});
