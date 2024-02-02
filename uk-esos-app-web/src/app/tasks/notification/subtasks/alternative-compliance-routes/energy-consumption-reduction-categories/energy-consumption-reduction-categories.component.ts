import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getTotalKwhSum } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input';
import { EnergySavingsCategoriesInputComponent } from '@shared/components/energy-savings-categories-input/energy-savings-categories-input.component';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { energyConsumptionReductionCategoriesFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/energy-consumption-reduction-categories/energy-consumption-reduction-categories-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent } from 'govuk-components';

import { EnergySavingsCategories } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-reduction-categories',
  standalone: true,
  imports: [WizardStepComponent, DetailsComponent, EnergySavingsCategoriesInputComponent, ReactiveFormsModule],
  templateUrl: './energy-consumption-reduction-categories.component.html',
  providers: [energyConsumptionReductionCategoriesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionReductionCategoriesComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
  private formData: Signal<EnergySavingsCategories> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });
  totalKWh: Signal<number> = computed(() => getTotalKwhSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes = {
          ...payload.noc.alternativeComplianceRoutes,
          energyConsumptionReductionCategories: {
            behaviourChangeInterventions: +this.form.get('behaviourChangeInterventions').value,
            energyManagementPractices: +this.form.get('energyManagementPractices').value,
            training: +this.form.get('training').value,
            controlsImprovements: +this.form.get('controlsImprovements').value,
            shortTermCapitalInvestments: +this.form.get('shortTermCapitalInvestments').value,
            longTermCapitalInvestments: +this.form.get('longTermCapitalInvestments').value,
            otherMeasures: +this.form.get('otherMeasures').value,
            total: this.totalKWh(),
          },
        };
      }),
    });
  }
}
