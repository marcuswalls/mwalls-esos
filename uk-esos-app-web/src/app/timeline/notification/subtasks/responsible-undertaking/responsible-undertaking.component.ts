import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ResponsibleUndertakingSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { ResponsibleUndertaking } from 'esos-api';

interface ViewModel {
  data: ResponsibleUndertaking;
  responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking>;
}

@Component({
  selector: 'esos-timeline-responsible-undertaking',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, ResponsibleUndertakingSummaryPageComponent],
  templateUrl: './responsible-undertaking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResponsibleUndertakingComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectResponsibleUndertaking)(),
    responsibleUndertakingMap: responsibleUndertakingMap,
  }));

  constructor(private readonly store: RequestActionStore) {}
}
