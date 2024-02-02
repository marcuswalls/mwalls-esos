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

import { DetailsComponent } from 'govuk-components';

import { EnergySavingsCategories } from 'esos-api';

import { CurrentStep, ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK } from '../energy-savings-opportunity.helper';
import { energySavingsOpportunityCategoryFormProvider } from './energy-savings-opportunity-category-form.provider';

@Component({
  selector: 'esos-energy-savings-opportunity-categories',
  standalone: true,
  imports: [WizardStepComponent, DetailsComponent, EnergySavingsCategoriesInputComponent, ReactiveFormsModule],
  templateUrl: './energy-savings-opportunity-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energySavingsOpportunityCategoryFormProvider],
})
export class EnergySavingsOpportunityCategoriesComponent {
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
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: CurrentStep.STEP2,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsOpportunities = {
          ...payload.noc.energySavingsOpportunities,
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
