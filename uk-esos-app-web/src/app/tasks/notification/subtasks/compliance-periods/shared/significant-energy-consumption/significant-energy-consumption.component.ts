import { ChangeDetectionStrategy, Component, computed, Inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  getSignificantPercentage,
  getTotalSum,
} from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { significantEnergyConsumptionFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/significant-energy-consumption/significant-energy-consumption-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, RadioComponent, RadioOptionComponent } from 'govuk-components';

import { EnergyConsumption, SignificantEnergyConsumption } from 'esos-api';

import { notificationQuery } from '../../../../+state/notification.selectors';
import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-significant-energy-consumption',
  templateUrl: './significant-energy-consumption.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RadioOptionComponent,
    WizardStepComponent,
    RadioComponent,
    EnergyConsumptionInputComponent,
    DetailsComponent,
  ],
  providers: [significantEnergyConsumptionFormProvider],
})
export class SignificantEnergyConsumptionComponent implements OnInit {
  isFirstCompliancePeriod: boolean;
  heading: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    private store: RequestTaskStore,
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {}

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION](this.isFirstCompliancePeriod);
  }

  formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  total: Signal<number> = computed(() => getTotalSum(this.formData()));

  percentage: Signal<number> = computed(() => {
    const compliancePeriod = this.isFirstCompliancePeriod
      ? this.store.select(notificationQuery.selectFirstCompliancePeriod)()
      : this.store.select(notificationQuery.selectSecondCompliancePeriod)();
    const totalValue = this.total();
    const totalConsumption = compliancePeriod?.firstCompliancePeriodDetails?.organisationalEnergyConsumption?.total;
    getSignificantPercentage(totalValue, totalConsumption);
    return Math.floor((totalValue / totalConsumption) * 100);
  });

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails,
            significantEnergyConsumption: {
              buildings: +this.form.get('buildings').value,
              transport: +this.form.get('transport').value,
              industrialProcesses: +this.form.get('industrialProcesses').value,
              otherProcesses: +this.form.get('otherProcesses').value,
              total: this.total(),
              significantEnergyConsumptionPct: this.percentage(),
            },
          };
        } else {
          payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails,
            significantEnergyConsumption: {
              buildings: +this.form.get('buildings').value,
              transport: +this.form.get('transport').value,
              industrialProcesses: +this.form.get('industrialProcesses').value,
              otherProcesses: +this.form.get('otherProcesses').value,
              total: this.total(),
              significantEnergyConsumptionPct: this.percentage(),
            } as SignificantEnergyConsumption,
          };
        }
      }),
    });
  }
}
