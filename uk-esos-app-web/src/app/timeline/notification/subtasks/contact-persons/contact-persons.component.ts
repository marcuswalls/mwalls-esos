import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ContactPersonsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { ContactPersons } from 'esos-api';

interface ViewModel {
  data: ContactPersons;
}

@Component({
  selector: 'esos-timeline-contact-persons',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, ContactPersonsSummaryPageComponent],
  templateUrl: './contact-persons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactPersonsComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectContactPersons)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}
