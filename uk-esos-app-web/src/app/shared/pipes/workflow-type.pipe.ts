import { Pipe, PipeTransform } from '@angular/core';

import { RequestDetailsDTO } from 'esos-api';

@Pipe({ name: 'workflowType' })
export class WorkflowTypePipe implements PipeTransform {
  transform(type: RequestDetailsDTO['requestType']): string {
    switch (type) {
      case 'ORGANISATION_ACCOUNT_OPENING':
        return 'Account creation';
      default:
        return null;
    }
  }
}
