import { EnergySavingsCategories } from 'esos-api';

export function getTotalKwhSum(energySavingsCategories: EnergySavingsCategories): number {
  return (
    +energySavingsCategories.energyManagementPractices +
    +energySavingsCategories.behaviourChangeInterventions +
    +energySavingsCategories.training +
    +energySavingsCategories.controlsImprovements +
    +energySavingsCategories.shortTermCapitalInvestments +
    +energySavingsCategories.longTermCapitalInvestments +
    +energySavingsCategories.otherMeasures
  );
}
