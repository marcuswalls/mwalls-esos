import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ContactPersonsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';

import { GovukComponentsModule } from 'govuk-components';

import { ContactPersons } from 'esos-api';

import {
  CONTACT_PERSONS_SUB_TASK,
  ContactPersonsCurrentStep,
  ContactPersonsWizardStep,
} from '../contact-persons.helper';

interface ViewModel {
  subtaskName: string;
  data: ContactPersons;
  isEditable: boolean;
  sectionsCompleted: NotificationTaskPayload['nocSectionsCompleted'];
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'esos-contact-persons-summary',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, PageHeadingComponent, RouterLink, ContactPersonsSummaryPageComponent],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsSummaryComponent {
  vm: Signal<ViewModel> = computed(() => {
    const isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
    const userInfo = this.store.select(notificationQuery.selectContactPersons)();
    const sectionsCompleted = this.store.select(notificationQuery.selectNocSectionsCompleted)();

    return {
      subtaskName: CONTACT_PERSONS_SUB_TASK,
      data: userInfo,
      isEditable,
      sectionsCompleted,
      wizardStep: ContactPersonsWizardStep,
    };
  });

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: CONTACT_PERSONS_SUB_TASK,
      currentStep: ContactPersonsCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
