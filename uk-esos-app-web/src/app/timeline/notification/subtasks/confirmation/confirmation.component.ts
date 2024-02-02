import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ConfirmationSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { Confirmations } from 'esos-api';

interface ViewModel {
  data: Confirmations;
}

@Component({
  selector: 'esos-timeline-confirmation',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, ConfirmationSummaryPageComponent],
  templateUrl: './confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmationComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectConfirmations)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
