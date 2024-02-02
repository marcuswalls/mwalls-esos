import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent } from 'govuk-components';

import { EnergyConsumption } from 'esos-api';

import { CurrentStep, ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK } from '../energy-savings-opportunity.helper';
import { energySavingsOpportunityFormProvider } from './energy-savings-opportunity-form.provider';

@Component({
  selector: 'esos-energy-savings-opportunity',
  standalone: true,
  imports: [WizardStepComponent, DetailsComponent, EnergyConsumptionInputComponent, ReactiveFormsModule],
  templateUrl: './energy-savings-opportunity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energySavingsOpportunityFormProvider],
})
export class EnergySavingsOpportunityComponent {
  private formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  totalkWh: Signal<number> = computed(() => getTotalSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: CurrentStep.STEP1,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsOpportunities = {
          ...payload.noc.energySavingsOpportunities,
          energyConsumption: {
            buildings: +this.form.get('buildings').value,
            transport: +this.form.get('transport').value,
            industrialProcesses: +this.form.get('industrialProcesses').value,
            otherProcesses: +this.form.get('otherProcesses').value,
            total: this.totalkWh(),
          },
        };
      }),
    });
  }
}
