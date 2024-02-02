import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationLocationFormComponent } from '@shared/components/organisation-location-form';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-location-container',
  template: ` <esos-organisation-location-form (submitForm)="onSubmit($event)"> </esos-organisation-location-form> `,
  imports: [OrganisationLocationFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationLocationContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organisationAccountStore: OrganisationAccountStore,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const location = formGroup.get('location').value;
        this.organisationAccountStore.setLocation(location);
        this.router.navigate(['../summary'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../summary'], { relativeTo: this.route });
      }
    }
  }
}
