import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ComplianceRouteSummaryPageComponent, ComplianceRouteViewModel } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

@Component({
  selector: 'esos-timeline-compliance-route',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, ComplianceRouteSummaryPageComponent],
  templateUrl: './compliance-route.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComplianceRouteComponent {
  vm: Signal<ComplianceRouteViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectComplianceRoute)(),
    isEditable: false,
  }));
  complianceRoute = this.store.select(notificationApplicationTimelineQuery.selectComplianceRoute);

  constructor(private readonly store: RequestActionStore) {}
}
