import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getTotalKwhSum } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input';
import { EnergySavingsCategoriesInputComponent } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsCategories } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK, EnergySavingsAchievedCurrentStep } from '../energy-savings-achieved.helper';
import { energySavingsAchievedCategoriesFormProvider } from './energy-savings-achieved-categories-form.provider';

@Component({
  selector: 'esos-energy-savings-achieved-categories',
  templateUrl: './energy-savings-achieved-categories.component.html',
  standalone: true,
  imports: [GovukComponentsModule, ReactiveFormsModule, WizardStepComponent, EnergySavingsCategoriesInputComponent],
  providers: [energySavingsAchievedCategoriesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedCategoriesComponent {
  private formData: Signal<EnergySavingsCategories> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  totalkWh: Signal<number> = computed(() => getTotalKwhSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.CATEGORIES,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsAchieved = {
          ...payload.noc.energySavingsAchieved,
          energySavingsCategories: {
            behaviourChangeInterventions: +this.form.get('behaviourChangeInterventions').value,
            energyManagementPractices: +this.form.get('energyManagementPractices').value,
            training: +this.form.get('training').value,
            controlsImprovements: +this.form.get('controlsImprovements').value,
            shortTermCapitalInvestments: +this.form.get('shortTermCapitalInvestments').value,
            longTermCapitalInvestments: +this.form.get('longTermCapitalInvestments').value,
            otherMeasures: +this.form.get('otherMeasures').value,
            total: this.totalkWh(),
          },
        };
      }),
    });
  }
}
