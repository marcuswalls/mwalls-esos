import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { organisationWizardCancelLinkPath } from '@shared/constants/cancel-wizard-link-constants';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';
import { organisationAddressFormProvider } from './organisation-address-form.provider';

@Component({
  selector: 'esos-organisation-address-form',
  templateUrl: './organisation-address-form.component.html',
  standalone: true,
  imports: [WizardStepComponent, SharedModule],
  providers: [organisationAddressFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAddressFormComponent {
  @Input() showCancelLink: boolean = true;
  formGroup: UntypedFormGroup;
  cancelLinkPath: string = organisationWizardCancelLinkPath;
  @Output() readonly submitForm = new EventEmitter<UntypedFormGroup>();

  constructor(@Inject(ORGANISATION_ACCOUNT_FORM) private readonly organisationForm: UntypedFormGroup) {
    this.formGroup = this.organisationForm;
  }

  onSubmit(): void {
    if (this.formGroup.valid || this.formGroup.dirty) {
      this.submitForm.emit(this.formGroup);
    }
  }
}
