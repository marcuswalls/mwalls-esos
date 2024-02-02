import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { AlternativeComplianceRoutesSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { AlternativeComplianceRoutes } from 'esos-api';

interface ViewModel {
  data: AlternativeComplianceRoutes;
  alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes>;
}

@Component({
  selector: 'esos-timeline-alternative-compliance-routes',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, AlternativeComplianceRoutesSummaryPageComponent],
  templateUrl: './alternative-compliance-routes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlternativeComplianceRoutesComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectAlternativeComplianceRoutes)(),
    alternativeComplianceRoutesMap: alternativeComplianceRoutesMap,
  }));

  constructor(private readonly store: RequestActionStore) {}
}
