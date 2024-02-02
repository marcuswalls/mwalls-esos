import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { ORGANISATION_ACCOUNT_FORM } from '../../../accounts/core/organisation-account-form.token';
import { OrganisationAccountStore } from '../../../accounts/organisation-account-application/+state';
import { organisationCompaniesHouseFormProvider } from './organisation-companies-house-form.provider';

@Component({
  selector: 'esos-organisation-companies-house-form',
  templateUrl: './organisation-companies-house-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SharedModule, WizardStepComponent],
  providers: [organisationCompaniesHouseFormProvider],
})
export class OrganisationCompaniesHouseFormComponent {
  @Input() showCancelLink: boolean = true;
  formGroup: UntypedFormGroup;
  cancelLinkPath: string = 'cancel';
  @Output() readonly submitForm = new EventEmitter<UntypedFormGroup>();

  constructor(
    private readonly route: ActivatedRoute,
    readonly organisationAccountStore: OrganisationAccountStore,
    private readonly router: Router,
    @Inject(ORGANISATION_ACCOUNT_FORM) private readonly organisationForm: FormGroup,
  ) {
    this.formGroup = this.organisationForm;
  }

  onSubmit(): void {
    if (this.formGroup.valid || this.formGroup.dirty) {
      this.submitForm.emit(this.formGroup);
    }
  }
}
