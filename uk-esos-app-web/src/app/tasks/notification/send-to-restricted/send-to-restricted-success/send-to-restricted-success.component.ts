import { NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ConfirmationSharedComponent } from '@shared/components/confirmation/confirmation.component';

import { GovukComponentsModule } from 'govuk-components';

interface State {
  participantFullName: string;
}

@Component({
  selector: 'esos-send-to-restricted-success',
  standalone: true,
  imports: [NgIf, GovukComponentsModule, ConfirmationSharedComponent],
  templateUrl: './send-to-restricted-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendToRestrictedSuccessComponent implements OnInit, OnDestroy {
  protected requestId = this.store.select(requestTaskQuery.selectRequestId);
  protected state: State;

  constructor(
    private readonly store: RequestTaskStore,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    private location: Location,
  ) {
    this.state = this.router.getCurrentNavigation()?.extras?.state as State;
  }

  ngOnInit(): void {
    if (!this.state?.participantFullName) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.location.replaceState('');
  }
}
