import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationAddressFormComponent } from '@shared/components/organisation-address-form';
import { OrganisationAccountApplicationReviewStateService } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review-state.service';
import { OrganisationApplicationReviewAmendService } from '@tasks/organisation-account-application-review/services/organisation-application-review-amend.service';

@Component({
  selector: 'esos-organisation-amend-address-container',
  template: `
    <esos-organisation-address-form [showCancelLink]="false" (submitForm)="onSubmit($event)">
    </esos-organisation-address-form>
  `,
  imports: [OrganisationAddressFormComponent, OrganisationAddressFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAmendAddressContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stateService: OrganisationAccountApplicationReviewStateService,
    private readonly amendService: OrganisationApplicationReviewAmendService,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const addressData = formGroup.value?.addressDetails;
        this.stateService.setAddress(addressData);
        this.amendService.submitAmendRequest().subscribe({
          next: () => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          },
        });
      } else {
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    }
  }
}
