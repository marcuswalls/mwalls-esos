import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { OrganisationStructureListTableComponent } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.component';
import { sortOrganisations } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.helper';
import { OrganisationStructureListTemplateViewModel } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.types';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { AssessmentPersonnelWizardStep } from '@tasks/notification/subtasks/assessment-personnel/assessment-personnel.helper';
import produce from 'immer';

import { ButtonDirective } from 'govuk-components';

import {
  getOrganisationDetails,
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
  OrganisationStructureWizardStep,
} from '../organisation-structure.helper';

@Component({
  selector: 'esos-organisation-structure-list',
  standalone: true,
  imports: [
    ButtonDirective,
    OrganisationStructureListTableComponent,
    PageHeadingComponent,
    PendingButtonDirective,
    RouterLink,
  ],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureListComponent {
  protected readonly wizardStep = AssessmentPersonnelWizardStep;
  protected readonly OrganisationStructureWizardStep = OrganisationStructureWizardStep;

  organisationStructure = this.store.select(notificationQuery.selectOrganisationStructure);

  vm: Signal<OrganisationStructureListTemplateViewModel> = computed(() => {
    const organisationDetailsRu = this.store.select(notificationQuery.selectResponsibleUndertaking)()
      ?.organisationDetails;
    const organisationDetailsOriginatedData = this.store.select(notificationQuery.selectAccountOriginatedData)()
      .organisationDetails;

    return {
      header: 'Organisations added',
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      isListPreviousPage: true,
      wizardStep: OrganisationStructureWizardStep,
      organisationDetails: getOrganisationDetails(organisationDetailsRu, organisationDetailsOriginatedData),
    };
  });

  queryParams: Params = this.vm().isEditable ? { change: true } : undefined;

  constructor(
    private store: RequestTaskStore,
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
  ) {}

  removeOrganisation(index: number) {
    const organisationsAssociatedWithRU = sortOrganisations([
      ...this.store.select(notificationQuery.selectOrganisationStructure)().organisationsAssociatedWithRU,
    ]).filter((_, i) => i !== index - 1);

    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.LIST_REMOVE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = {
          ...payload.noc.organisationStructure,
          organisationsAssociatedWithRU,
        };
      }),
    });
  }
}
