import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';
import { organisationNameFormProvider } from './organisation-name-form.provider';

@Component({
  selector: 'esos-organisation-name-form',
  templateUrl: './organisation-name-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WizardStepComponent, SharedModule],
  providers: [organisationNameFormProvider],
})
export class OrganisationNameFormComponent {
  @Input() showCancelLink: boolean = true;
  formGroup: UntypedFormGroup;
  cancelLinkPath: string = 'cancel';
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
