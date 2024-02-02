import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from 'govuk-components';

@Component({
  selector: 'esos-notification-wait-for-edit',
  standalone: true,
  imports: [WarningTextComponent],
  template: `
    <govuk-warning-text assistiveText="Warning"> Waiting for review. You cannot make any changes. </govuk-warning-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationWaitForEditComponent {}
