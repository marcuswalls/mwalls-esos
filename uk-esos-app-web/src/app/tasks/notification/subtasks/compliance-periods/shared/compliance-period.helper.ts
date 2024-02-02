export const SUB_TASK_FIRST_COMPLIANCE_PERIOD = 'firstCompliancePeriod';
export const SUB_TASK_SECOND_COMPLIANCE_PERIOD = 'secondCompliancePeriod';

export enum CurrentStep {
  SUMMARY = '',
  INFORMATION_EXISTS = 'informationExists',
  ORGANISATIONAL_ENERGY_CONSUMPTION = 'organisationalEnergyConsumption',
  SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS = 'SignificantEnergyConsumptionExists',
  SIGNIFICANT_ENERGY_CONSUMPTION = 'significantEnergyConsumption',
  EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION = 'hasExplanationOfChangesToTotalEnergyConsumption',
  POTENTIAL_REDUCTION_EXISTS = 'potentialReductionExists',
  POTENTIAL_REDUCTION = 'potentialReduction',
  REDUCTION_ACHIEVED_EXISTS = 'reductionAchievedExists',
  REDUCTION_ACHIEVED = 'reductionAchieved',
}

export enum WizardStep {
  SUMMARY = '',
  INFORMATION_EXISTS = 'information-exists',
  ORGANISATIONAL_ENERGY_CONSUMPTION = 'organisational-energy-consumption',
  SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS = 'significant-energy-consumption-exists',
  SIGNIFICANT_ENERGY_CONSUMPTION = 'significant-energy-consumption',
  EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION = 'explanation-of-changes-to-total-energy-consumption',
  POTENTIAL_REDUCTION_EXISTS = 'potential-reduction-exists',
  POTENTIAL_REDUCTION = 'potential-reduction',
  REDUCTION_ACHIEVED_EXISTS = 'reduction-achieved-exists',
  REDUCTION_ACHIEVED = 'reduction-achieved',
}
