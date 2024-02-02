import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BaseSuccessComponent } from '@shared/base-success/base-success.component';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'esos-organisation-account-application-received',
  templateUrl: './organisation-account-application-received.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class OrganisationAccountApplicationReceivedComponent extends BaseSuccessComponent {}
