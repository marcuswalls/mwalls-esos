import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'esos-two-fa-link',
  template: `
    <div class="govuk-button-group">
      <a
        govukLink
        [routerLink]="link"
        [relativeTo]="route"
        [state]="{ userId: userId, accountId: accountId, userName: userName, role: role }"
      >
        {{ title }}</a
      >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFaLinkComponent {
  @Input() title: string;
  @Input() link: string;
  @Input() userId: string;
  @Input() accountId: number;
  @Input() userName: string;
  @Input() role: string;

  constructor(protected route: ActivatedRoute) {}
}
