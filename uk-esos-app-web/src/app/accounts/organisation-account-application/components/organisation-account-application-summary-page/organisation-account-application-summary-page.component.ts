import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { tap } from 'rxjs';

import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { GovukComponentsModule } from 'govuk-components';

import { OrganisationAccountPayload } from 'esos-api';

import { OrganisationAccountService } from '../../../core/organisation-account.service';
import { organisationAccountQuery, OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-account-application-summary-page',
  templateUrl: './organisation-account-application-summary-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, NgIf, GovukComponentsModule, OrganisationAccountSummaryComponent, RouterLink],
})
export class OrganisationAccountApplicationSummaryPageComponent {
  isSubmitDisabled: boolean;
  organisation: OrganisationAccountPayload;
  linkPrefix: string = '..';

  registrationStatus = this.store.select(organisationAccountQuery.selectRegistrationStatus);
  registrationNumber = this.store.select(organisationAccountQuery.selectRegistrationNumber);
  name = this.store.select(organisationAccountQuery.selectName);
  address = this.store.select(organisationAccountQuery.selectAddress);
  competentAuthority = this.store.select(organisationAccountQuery.selectCompetentAuthority);

  constructor(
    readonly store: OrganisationAccountStore,
    private readonly organisationAccountService: OrganisationAccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.organisation = organisationAccountService.payload;
  }

  onSubmit(): void {
    this.isSubmitDisabled = true;
    this.organisationAccountService
      .submitSummary()
      .pipe(tap(() => this.store.reset()))
      .subscribe({
        next: () => {
          this.router.navigate(['../submitted'], { relativeTo: this.route });
        },
      });
  }
}
