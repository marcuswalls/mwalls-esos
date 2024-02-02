import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-account-application-cancel',
  template: `
    <esos-page-heading caption="Cancel organisation account creation" size="xl">
      Are you sure you want to cancel this account application?
    </esos-page-heading>

    <p class="govuk-body">The data entered will be permanently deleted. This action cannot be undone.</p>

    <div class="govuk-button-group">
      <button govukWarnButton type="button" routerLink="/landing" (click)="store.reset()">Yes, reset</button>
      <a govukLink routerLink="..">Cancel</a>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, SharedModule, RouterLink],
})
export class OrganisationAccountApplicationCancelComponent {
  constructor(readonly store: OrganisationAccountStore) {}
}
