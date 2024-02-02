import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { GovukTableColumn } from 'govuk-components';

import { ComplianceRoute } from 'esos-api';

import { EnergyAuditListViewModel } from './energy-audit-list.types';

@Component({
  selector: 'esos-energy-audit-list',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './energy-audit-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyAuditListComponent {
  @Input() vm: EnergyAuditListViewModel;
  @Input() complianceRoute: Signal<ComplianceRoute>;
  @Output() readonly removeEnergyAudit = new EventEmitter<number>();

  columns: GovukTableColumn[] = [
    {
      header: '#',
      field: 'index',
    },
    {
      header: 'Description',
      field: 'description',
    },
    {
      header: 'Number of sites covered',
      field: 'numberOfSitesCovered',
    },
    {
      header: 'Number of sites visited',
      field: 'numberOfSitesVisited',
    },
    {
      header: 'Reason',
      field: 'reason',
    },
    {
      header: '',
      field: 'actions',
    },
  ];

  onRemoveEnergyAudit(index: number) {
    this.removeEnergyAudit.emit(index);
  }
}
