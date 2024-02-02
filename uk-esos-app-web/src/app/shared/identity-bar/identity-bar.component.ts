import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IdentityBarService } from '@core/services/identity-bar.service';

@Component({
  selector: 'esos-identity-bar',
  template: `
    <div class="esos-identity-bar" *ngIf="barService.content | async as content">
      <div class="esos-identity-bar__container">
        <div class="esos-identity-bar__details">
          <div class="esos-identity-bar__title" [innerHTML]="content"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./identity-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentityBarComponent {
  constructor(public readonly barService: IdentityBarService) {}
}
