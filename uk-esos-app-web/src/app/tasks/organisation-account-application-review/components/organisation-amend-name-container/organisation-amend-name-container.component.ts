import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationNameFormComponent } from '@shared/components/organisation-name-form';
import { OrganisationAccountApplicationReviewStateService } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review-state.service';
import { OrganisationApplicationReviewAmendService } from '@tasks/organisation-account-application-review/services/organisation-application-review-amend.service';

@Component({
  selector: 'esos-organisation-amend-name-container',
  template: `
    <esos-organisation-name-form [showCancelLink]="false" (submitForm)="onSubmit($event)">
    </esos-organisation-name-form>
  `,
  imports: [OrganisationNameFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAmendNameContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stateService: OrganisationAccountApplicationReviewStateService,
    private readonly amendService: OrganisationApplicationReviewAmendService,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const registeredName = formGroup.get('registeredName').value;
        this.stateService.setRegisteredName(registeredName);
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
