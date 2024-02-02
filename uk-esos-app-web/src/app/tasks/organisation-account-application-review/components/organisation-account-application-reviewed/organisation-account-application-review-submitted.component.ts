import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseSuccessComponent } from '@shared/base-success/base-success.component';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'esos-organisation-account-application-reviewed',
  templateUrl: './organisation-account-application-review-submitted.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, NgIf],
})
export class OrganisationAccountApplicationReviewSubmittedComponent extends BaseSuccessComponent implements OnInit {
  isReviewAccepted: boolean = false;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams.subscribe((params) => {
      this.isReviewAccepted = params['isAccepted'] === 'true';
    });
  }
}
