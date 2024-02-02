import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationCompaniesHouseFormComponent } from '@shared/components/organisation-companies-house-form';

import { OrganisationAccountStore } from '../../+state';

@Component({
  selector: 'esos-organisation-companies-house-container',
  template: `
    <esos-organisation-companies-house-form (submitForm)="onSubmit($event)"> </esos-organisation-companies-house-form>
  `,
  imports: [OrganisationCompaniesHouseFormComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationCompaniesHouseContainerComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organisationAccountStore: OrganisationAccountStore,
  ) {}

  onSubmit(formGroup: UntypedFormGroup): void {
    if (formGroup.valid) {
      if (formGroup.dirty) {
        const registrationStatus = formGroup.get('registrationStatus').value;
        const registrationNumber = formGroup.get('registrationNumber').value;
        this.organisationAccountStore.setRegistrationStatus(registrationStatus);
        registrationStatus
          ? this.organisationAccountStore.setRegistrationNumber(registrationNumber)
          : this.organisationAccountStore.setRegistrationNumber(null);
        this.router.navigate(['name'], { relativeTo: this.route });
      } else {
        this.router.navigate(['name'], { relativeTo: this.route });
      }
    }
  }
}
