export const ENERGY_CONSUMPTION_SUB_TASK = 'energyConsumptionDetails';

export enum CurrentStep {
  TOTAL_ENERGY = 'totalEnergy',
  USE_SIGNIFICANT_ENERGY = 'useSignificantEnergy',
  SIGNIFICANT_ENERGY = 'significantEnergy',
  ENERGY_INTENSITY_RATIO = 'energyIntensityRatio',
  ADDITIONAL_INFO = 'additionalInfo',
  SUMMARY = 'summary',
}

export enum WizardStep {
  TOTAL_ENERGY = 'total-energy',
  USE_SIGNIFICANT_ENERGY = 'use-significant-energy',
  SIGNIFICANT_ENERGY = 'significant-energy',
  ENERGY_INTENSITY_RATIO = 'energy-intensity-ratio',
  ADDITIONAL_INFO = 'additional-info',
  SUMMARY = '../',
}
