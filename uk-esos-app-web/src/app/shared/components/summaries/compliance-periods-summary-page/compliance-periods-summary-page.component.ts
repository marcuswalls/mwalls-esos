import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { EnergyConsumptionDetailsSummaryTemplateComponent, WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';

import {
  GovukComponentsModule,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective
} from 'govuk-components';

import { SecondCompliancePeriod } from 'esos-api';

@Component({
  selector: 'esos-compliance-periods-summary-page',
  standalone: true,
  imports: [
    GovukComponentsModule,
    NgIf,
    PipesModule,
    RouterLink,
    JsonPipe,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    BooleanToTextPipe,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective
  ],
  templateUrl: './compliance-periods-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompliancePeriodsSummaryPageComponent implements OnInit {
  @Input() compliancePeriod: SecondCompliancePeriod;
  @Input() isEditable = false;
  @Input() isFirstCompliancePeriod: boolean;
  @Input() wizardStep: { [s: string]: string };
  changeQueryParams: Params = { change: true };

  //headings
  informationExistsHeading: string;
  organisationalEnergyConsumptionHeading: string;
  significantEnergyConsumptionExistsHeading: string;
  significantEnergyConsumptionHeading: string;
  explanationOfChangesToTotalConsumptionHeading: string;
  potentialReductionExistsHeading: string;
  potentialReductionHeading: string;
  reductionAchievedExistsHeading: string;
  reductionAchievedHeading: string;

  constructor(readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.informationExistsHeading = WIZARD_STEP_HEADINGS[this.wizardStep.INFORMATION_EXISTS](
      this.isFirstCompliancePeriod,
    );
    this.organisationalEnergyConsumptionHeading = WIZARD_STEP_HEADINGS[
      this.wizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION
    ](this.isFirstCompliancePeriod);
    this.significantEnergyConsumptionExistsHeading = WIZARD_STEP_HEADINGS[
      this.wizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS
    ](this.isFirstCompliancePeriod);
    this.significantEnergyConsumptionHeading = WIZARD_STEP_HEADINGS[this.wizardStep.SIGNIFICANT_ENERGY_CONSUMPTION](
      this.isFirstCompliancePeriod,
    );
    this.explanationOfChangesToTotalConsumptionHeading = WIZARD_STEP_HEADINGS[
      this.wizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION
    ](this.isFirstCompliancePeriod);
    this.potentialReductionExistsHeading = WIZARD_STEP_HEADINGS[this.wizardStep.POTENTIAL_REDUCTION_EXISTS](
      this.isFirstCompliancePeriod,
    );
    this.potentialReductionHeading = WIZARD_STEP_HEADINGS[this.wizardStep.POTENTIAL_REDUCTION](
      this.isFirstCompliancePeriod,
    );
    this.reductionAchievedExistsHeading = WIZARD_STEP_HEADINGS[this.wizardStep.REDUCTION_ACHIEVED_EXISTS](
      this.isFirstCompliancePeriod,
    );
    this.reductionAchievedHeading = WIZARD_STEP_HEADINGS[this.wizardStep.REDUCTION_ACHIEVED](
      this.isFirstCompliancePeriod,
    );
  }
}
