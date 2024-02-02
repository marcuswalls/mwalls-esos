import { getSignificantPercentage } from '@shared/components/energy-consumption-input/energy-consumption-input';

import { EnergyConsumptionDetails } from 'esos-api';

export const isWizardCompleted = (energyConsumption: EnergyConsumptionDetails) => {
  const percentage = getSignificantPercentage(
    energyConsumption?.totalEnergyConsumption?.total ?? 0,
    energyConsumption?.significantEnergyConsumption?.total ?? 0,
  );

  return (
    !!energyConsumption &&
    !!energyConsumption.totalEnergyConsumption &&
    energyConsumption.significantEnergyConsumptionExists != null &&
    ((energyConsumption.significantEnergyConsumptionExists &&
      !!energyConsumption.significantEnergyConsumption &&
      percentage >= 95 &&
      percentage <= 100) ||
      (!energyConsumption.significantEnergyConsumptionExists && !energyConsumption.significantEnergyConsumption)) &&
    !!energyConsumption.energyIntensityRatioData &&
    energyConsumption.additionalInformationExists != null
  );
};
