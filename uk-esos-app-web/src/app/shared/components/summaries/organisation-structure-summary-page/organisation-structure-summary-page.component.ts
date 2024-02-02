import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { OrganisationStructureListTableComponent } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.component';
import { OrganisationStructureListTemplateViewModel } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.types';
import { OrganisationStructureViewModel } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

@Component({
  selector: 'esos-organisation-structure-summary-page',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, OrganisationStructureListTableComponent, RouterLink, BooleanToTextPipe],
  templateUrl: './organisation-structure-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureSummaryPageComponent implements OnInit {
  @Input() vm: OrganisationStructureViewModel;
  @Input() organisationStructure: Signal<OrganisationStructure>;
  @Output() readonly removeOrganisationSummary = new EventEmitter<number>();

  vmList: Signal<OrganisationStructureListTemplateViewModel>;
  queryParams: Params;

  ngOnInit(): void {
    this.queryParams = this.vm.isEditable ? { change: true } : undefined;

    this.vmList = signal({
      header: 'Add the organisations that are associated with this responsible undertaking',
      isListPreviousPage: false,
      wizardStep: this.vm.wizardStep,
      isEditable: this.vm.isEditable,
      organisationDetails: this.vm.organisationDetails,
    });
  }

  removeOrganisation(index: number) {
    this.removeOrganisationSummary.emit(index);
  }
}
