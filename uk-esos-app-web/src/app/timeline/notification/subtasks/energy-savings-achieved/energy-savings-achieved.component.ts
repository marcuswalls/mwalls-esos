import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { EnergySavingsAchievedSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { EnergySavingsAchieved } from 'esos-api';

interface ViewModel {
  data: EnergySavingsAchieved;
}

@Component({
  selector: 'esos-timeline-energy-savings-achieved',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, EnergySavingsAchievedSummaryPageComponent],
  templateUrl: './energy-savings-achieved.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectEnergySavingsAchieved)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
