import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationLocationFormComponent } from '@shared/components/organisation-location-form';
import { OrganisationAccountApplicationReviewStateService } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review-state.service';
import { OrganisationApplicationReviewAmendService } from '@tasks/organisation-account-application-review/services/organisation-application-review-amend.service';

@Component({
  selector: 'esos-organisation-amend-location-container',
  template: `
    <esos-organisation-location-form [showCancelLink]="false" (submitForm)="onSubmit($event)">
    </esos-organisation-location-form>
  `,
  imports: [OrganisationLocationFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAmendLocationContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stateService: OrganisationAccountApplicationReviewStateService,
    private readonly amendService: OrganisationApplicationReviewAmendService,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const location = formGroup.get('location').value;
        this.stateService.setLocation(location);
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
