import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationCompaniesHouseFormComponent } from '@shared/components/organisation-companies-house-form';
import { OrganisationAccountApplicationReviewStateService } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review-state.service';
import { OrganisationApplicationReviewAmendService } from '@tasks/organisation-account-application-review/services/organisation-application-review-amend.service';

@Component({
  selector: 'esos-organisation-amend-companies-house-container',
  template: `
    <esos-organisation-companies-house-form [showCancelLink]="false" (submitForm)="onSubmit($event)">
    </esos-organisation-companies-house-form>
  `,
  imports: [OrganisationCompaniesHouseFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAmendCompaniesHouseContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stateService: OrganisationAccountApplicationReviewStateService,
    private readonly amendService: OrganisationApplicationReviewAmendService,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const registrationStatus = formGroup.get('registrationStatus').value;
        const registrationNumber = formGroup.get('registrationNumber').value;
        registrationStatus
          ? this.stateService.setRegistrationNumber(registrationNumber)
          : this.stateService.setRegistrationNumber(null);
        this.amendService.submitAmendRequest().subscribe({
          next: () => {
            this.router.navigate(['../'], { relativeTo: this.route });
          },
        });
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }
}
