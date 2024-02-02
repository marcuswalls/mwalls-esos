import { Pipe, PipeTransform } from '@angular/core';

import { RequestActionDTO } from 'esos-api';

@Pipe({
  name: 'actionTypeToBreadcrumb',
  standalone: true,
  pure: true,
})
export class ActionTypeToBreadcrumbPipe implements PipeTransform {
  transform(type: RequestActionDTO['type']): unknown {
    switch (type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED':
        return 'Original application submitted';
      case 'ORGANISATION_ACCOUNT_OPENING_APPROVED':
        return 'Organisation account approved';
      case 'ORGANISATION_ACCOUNT_OPENING_REJECTED':
        return 'Organisation account rejected';

      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT':
        return 'Notification sent for review';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT':
        return 'Notification returned';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED':
        return 'Notification submitted';
      default:
        return null;
    }
  }
}
