import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ReportingObligationSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { ReportingObligation } from 'esos-api';

interface ViewModel {
  data: ReportingObligation;
}

@Component({
  selector: 'esos-timeline-reporting-obligation',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, ReportingObligationSummaryPageComponent],
  templateUrl: './reporting-obligation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportingObligationComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectReportingObligation)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
