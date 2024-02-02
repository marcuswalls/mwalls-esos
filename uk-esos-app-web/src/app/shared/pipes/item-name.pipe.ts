import { Pipe, PipeTransform } from '@angular/core';

import { ItemDTO } from 'esos-api';

@Pipe({ name: 'itemName', pure: true, standalone: true })
export class ItemNamePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: ItemDTO['taskType'], year?: string | number): string {
    switch (value) {
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
