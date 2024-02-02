import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { EnergyIntensityRatioInputComponent } from '@shared/components/energy-intensity-ratio-input/energy-intensity-ratio-input.component';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  ENERGY_CONSUMPTION_SUB_TASK,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import {
  createOtherIntensityRatio,
  energyIntensityRatioFormProvider,
} from '@tasks/notification/subtasks/energy-consumption/energy-intensity-ratio/energy-intensity-ratio-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-energy-intensity-ratio',
  standalone: true,
  imports: [WizardStepComponent, ReactiveFormsModule, EnergyIntensityRatioInputComponent, SharedModule, RouterLink],
  templateUrl: './energy-intensity-ratio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyIntensityRatioFormProvider],
})
export class EnergyIntensityRatioComponent {
  otherProcessesIntensityRatiosFormArray = (this.form.controls.otherProcessesIntensityRatios as FormArray)
    .controls as FormGroup[];

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  addOtherRatioGroup(): void {
    (this.form.controls.otherProcessesIntensityRatios as FormArray).push(createOtherIntensityRatio());
  }

  deleteRatioGroup(index: number): void {
    (this.form.controls.otherProcessesIntensityRatios as FormArray).removeAt(index);
  }

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: CurrentStep.ENERGY_INTENSITY_RATIO,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energyConsumptionDetails = {
          ...payload.noc.energyConsumptionDetails,
          energyIntensityRatioData: {
            ...this.form.value,
          },
        };
      }),
    });
  }
}
