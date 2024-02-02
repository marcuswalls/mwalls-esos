import { Pipe, PipeTransform } from '@angular/core';

import { InstallationAccountDTO } from 'esos-api';

// TODO: remove this pipe since there is only one account type
@Pipe({ name: 'accountType' })
export class AccountTypePipe implements PipeTransform {
  transform(type: InstallationAccountDTO['accountType']): string {
    switch (type) {
      case 'INSTALLATION':
        return 'Installation';
      case 'AVIATION':
        return 'Aviation';
      case 'ORGANISATION':
        return 'Organisation';
      default:
        return null;
    }
  }
}
