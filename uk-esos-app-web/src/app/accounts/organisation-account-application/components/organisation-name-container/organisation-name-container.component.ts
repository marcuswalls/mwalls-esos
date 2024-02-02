import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationNameFormComponent } from '@shared/components/organisation-name-form';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-name-container',
  template: ` <esos-organisation-name-form (submitForm)="onSubmit($event)"> </esos-organisation-name-form> `,
  imports: [OrganisationNameFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationNameContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organisationAccountStore: OrganisationAccountStore,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const registeredName = formGroup.get('registeredName').value;
        this.organisationAccountStore.setRegisteredName(registeredName);
        this.router.navigate(['../address'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../address'], { relativeTo: this.route });
      }
    }
  }
}
