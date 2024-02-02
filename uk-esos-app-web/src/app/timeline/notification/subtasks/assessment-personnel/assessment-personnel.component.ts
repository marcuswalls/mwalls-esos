import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { PersonnelListTemplateComponent } from '@shared/components/personnel-list-template/personnel-list-template.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { PersonnelDetails } from 'esos-api';

interface ViewModel {
  data: PersonnelDetails[];
}

@Component({
  selector: 'esos-timeline-assessment-personnel',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, PersonnelListTemplateComponent],
  templateUrl: './assessment-personnel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssessmentPersonnelComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectAssessmentPersonnel)()?.personnel,
  }));

  constructor(private readonly store: RequestActionStore) {}
}
