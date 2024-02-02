import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-user-registration',
  template: `<router-outlet esosSkipLinkFocus></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationComponent {}
