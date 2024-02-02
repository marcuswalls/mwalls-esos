import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent } from 'govuk-components';

import { EnergyConsumption } from 'esos-api';

import { energyConsumptionReductionFormProvider } from './energy-consumption-reduction-form.provider';

@Component({
  selector: 'esos-energy-consumption-reduction',
  standalone: true,
  imports: [WizardStepComponent, EnergyConsumptionInputComponent, DetailsComponent, ReactiveFormsModule],
  templateUrl: './energy-consumption-reduction.component.html',
  providers: [energyConsumptionReductionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionReductionComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
  private formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  totalKWh: Signal<number> = computed(() => getTotalSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes = {
          ...payload.noc.alternativeComplianceRoutes,
          energyConsumptionReduction: {
            buildings: +this.form.get('buildings').value,
            transport: +this.form.get('transport').value,
            industrialProcesses: +this.form.get('industrialProcesses').value,
            otherProcesses: +this.form.get('otherProcesses').value,
            total: this.totalKWh(),
          },
        };
      }),
    });
  }
}
