import { EnergySavingsOpportunities } from 'esos-api';

export const isWizardCompleted = (energySavingsOpportunities: EnergySavingsOpportunities) => {
  return (
    !!energySavingsOpportunities?.energyConsumption &&
    !!energySavingsOpportunities?.energySavingsCategories &&
    energySavingsOpportunities?.energyConsumption?.total === energySavingsOpportunities?.energySavingsCategories?.total
  );
};
