import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { existingControlContainer } from '@shared/providers/control-container.factory';

import { GovukComponentsModule } from 'govuk-components';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-energy-intensity-ratio-input',
  templateUrl: './energy-intensity-ratio-input.component.html',
  imports: [ReactiveFormsModule, GovukComponentsModule, NgIf],
  standalone: true,
  viewProviders: [existingControlContainer],
})
export class EnergyIntensityRatioInputComponent {
  @Input() hasAdditionalInfo = false;
}
