import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { PaginationComponent } from '@shared/pagination/pagination.component';

import { GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

import { OrganisationStructure } from 'esos-api';

import { sortOrganisations } from './organisations-structure-list-template.helper';
import {
  Organisation,
  OrganisationStructureListTemplateViewModel,
} from './organisations-structure-list-template.types';

@Component({
  selector: 'esos-organisation-structure-list-table',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    PaginationComponent,
    RouterLink,
    TableComponent,
    LinkDirective,
  ],
  templateUrl: './organisations-structure-list-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureListTableComponent implements OnInit {
  @Input() vm: OrganisationStructureListTemplateViewModel;
  @Input() organisationStructure: Signal<OrganisationStructure>;
  @Output() readonly removeOrganisation = new EventEmitter<number>();
  @Input() queryParams: Params;

  readonly pageSize = 10;

  organisations: Signal<Organisation[]>;
  organisationsLength: number;
  page = signal(this.route.snapshot.queryParams.page ?? 1);

  tableColumns: GovukTableColumn[] = [
    { field: 'organisationDetails', header: 'Organisation' },
    { field: 'isCoveredByThisNotification', header: 'Covered in this NOC' },
    { field: 'isPartOfArrangement', header: 'Co-parent organisation included' },
    { field: 'isParentOfResponsibleUndertaking', header: 'Parent of this RU' },
    { field: 'isSubsidiaryOfResponsibleUndertaking', header: 'Subsidiary of this RU' },
    { field: 'isPartOfFranchise', header: 'Franchise' },
    { field: 'isTrust', header: 'Trust' },
    { field: 'hasCeasedToBePartOfGroup', header: 'Ceased trading 31/12/22 to 05/06/24' },
    { field: 'links', header: undefined },
  ];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.organisationsLength = (this.organisationStructure()?.organisationsAssociatedWithRU ?? []).length;

    this.organisations = computed(() => {
      const page = this.page();
      const pageStart = (page - 1) * this.pageSize;
      const pageEnd = page * this.pageSize;
      let organisationsList = [];

      const organisationsAssociatedWithRU = sortOrganisations([
        ...(this.organisationStructure()?.organisationsAssociatedWithRU ?? []),
      ]);

      organisationsList = [
        ...organisationsList,
        ...organisationsAssociatedWithRU.map((organisation) => ({
          ...organisation,
          organisationDetails: this.organisationDetailsColumn(organisation),
        })),
      ].filter((_, index) => index < pageEnd && index >= pageStart);

      if (page === 1) {
        organisationsList.unshift(this.addResponsibleUndertaking());
      } else {
        organisationsList.shift();
      }

      return organisationsList;
    });
  }

  private addResponsibleUndertaking(): Organisation {
    const ruOrganisationDetails = this.vm.organisationDetails;

    const { organisationsAssociatedWithRU, ...ruOrganisation } = this.organisationStructure() ?? {};

    return {
      ...ruOrganisation,
      isCoveredByThisNotification: true,
      organisationDetails: this.organisationDetailsColumn(ruOrganisationDetails),
    };
  }

  private organisationDetailsColumn(organisation: Organisation) {
    const { name, organisationName, registrationNumber, taxReferenceNumber } = organisation ?? {};

    const orgName = name ?? organisationName;
    const details = registrationNumber
      ? '\n' + registrationNumber
      : taxReferenceNumber
      ? '\n' + taxReferenceNumber
      : '';

    return `${orgName} ${details}`;
  }

  removeOrganisationClicked(index: number) {
    this.removeOrganisation.emit(index);
  }
}
