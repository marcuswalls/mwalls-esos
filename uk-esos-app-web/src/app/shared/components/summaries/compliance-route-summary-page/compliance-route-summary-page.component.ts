import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EnergyAuditListComponent } from '@shared/components/energy-audit-list/energy-audit-list.component';
import { EnergyAuditListViewModel } from '@shared/components/energy-audit-list/energy-audit-list.types';
import { ComplianceRouteViewModel } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { ComplianceRoute } from 'esos-api';

@Component({
  selector: 'esos-compliance-route-summary-page',
  standalone: true,
  imports: [
    GovukComponentsModule,
    NgIf,
    EnergyAuditListComponent,
    RouterLink,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    BooleanToTextPipe,
  ],
  templateUrl: './compliance-route-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceRouteSummaryPageComponent implements OnInit {
  @Input() vm: ComplianceRouteViewModel;
  @Input() complianceRoute: Signal<ComplianceRoute>;
  @Output() readonly removeEnergyAuditSummary = new EventEmitter<number>();

  vmList: Signal<EnergyAuditListViewModel>;

  ngOnInit(): void {
    this.vmList = signal({
      header: 'Add an energy audit (optional)',
      prefix: './',
      wizardStep: this.vm.wizardStep,
      isEditable: this.vm.isEditable,
    });
  }

  removeEnergyAudit(index: number) {
    this.removeEnergyAuditSummary.emit(index);
  }
}
