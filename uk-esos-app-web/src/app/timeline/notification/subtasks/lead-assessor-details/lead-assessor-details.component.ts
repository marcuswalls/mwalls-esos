import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { LeadAssessorDetailsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { LeadAssessor } from 'esos-api';

interface ViewModel {
  data: LeadAssessor;
}

@Component({
  selector: 'esos-timeline-lead-assessor-details',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, LeadAssessorDetailsSummaryPageComponent],
  templateUrl: './lead-assessor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadAssessorDetailsComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectLeadAssessor)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
