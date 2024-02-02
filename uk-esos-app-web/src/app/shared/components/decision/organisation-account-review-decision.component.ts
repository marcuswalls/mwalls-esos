import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';
import { OrganisationApplicationReviewSubmitDecisionService } from '@tasks/organisation-account-application-review/services/organisation-application-review-submit-decision.service';

import { GovukValidators } from 'govuk-components';

import { UserFullNamePipe } from '../../pipes/user-full-name.pipe';

@Component({
  selector: 'esos-organisation-account-review-decision',
  templateUrl: './organisation-account-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [UserFullNamePipe],
  imports: [SharedModule, PendingButtonDirective],
})
export class OrganisationAccountReviewDecisionComponent {
  decisionForm: UntypedFormGroup = this.fb.group({
    isAccepted: [null, GovukValidators.required('You need to approve or reject the application')],
    acceptanceReason: [
      null,
      [
        GovukValidators.required('Explain why you are approving this application'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    ],
    rejectionReason: [
      null,
      [
        GovukValidators.required('Enter the reason for rejection'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ],
    ],
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: UntypedFormBuilder,
    private readonly service: OrganisationApplicationReviewSubmitDecisionService,
  ) {}

  onSubmit(): void {
    if (this.decisionForm.valid) {
      const isAccepted = this.decisionForm.get('isAccepted').value;
      const reason = this.decisionForm.get(isAccepted ? 'acceptanceReason' : 'rejectionReason').value;
      this.service.submitDecision(isAccepted, reason).subscribe({
        next: () => {
          const isAccepted = this.decisionForm.get('isAccepted').value;
          this.router.navigate(['organisation-account-application-review/submitted'], {
            relativeTo: this.route,
            queryParams: { isAccepted: isAccepted },
          });
        },
      });
    }
  }
}
