import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationAddressFormComponent } from '@shared/components/organisation-address-form';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-address-container',
  template: ` <esos-organisation-address-form (submitForm)="onSubmit($event)"> </esos-organisation-address-form> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrganisationAddressFormComponent],
  standalone: true,
})
export class OrganisationAddressContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organisationAccountStore: OrganisationAccountStore,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const addressData = formGroup.value?.addressDetails;
        this.organisationAccountStore.setAddress(addressData);
        this.router.navigate(['../location'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../location'], { relativeTo: this.route });
      }
    }
  }
}
