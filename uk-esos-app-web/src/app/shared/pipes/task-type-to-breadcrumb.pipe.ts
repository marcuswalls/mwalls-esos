import { Pipe, PipeTransform } from '@angular/core';

import { RequestTaskDTO } from 'esos-api';

@Pipe({
  name: 'taskTypeToBreadcrumb',
  standalone: true,
  pure: true,
})
export class TaskTypeToBreadcrumbPipe implements PipeTransform {
  transform(type: RequestTaskDTO['type']): string {
    switch (type) {
      case 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW':
        return 'Review organisation account application';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
        return 'Submit notification';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
        return 'Review Phase 3 notification';
      case 'NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT':
        return 'Awaiting review of Phase 3 notification';

      default:
        return null;
    }
  }
}
