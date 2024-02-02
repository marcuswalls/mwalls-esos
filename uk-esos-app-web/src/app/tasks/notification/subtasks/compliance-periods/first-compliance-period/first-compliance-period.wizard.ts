import { getSignificantPercentage } from '@shared/components/energy-consumption-input/energy-consumption-input';

import { FirstCompliancePeriod } from 'esos-api';

export const isWizardCompleted = (firstCompliancePeriod: FirstCompliancePeriod) => {
  const { informationExists, firstCompliancePeriodDetails } = firstCompliancePeriod ?? {};

  if (informationExists === false) {
    return true;
  }

  const isOrganisationalEnergyConsumptionDetailsCompleted =
    firstCompliancePeriodDetails?.organisationalEnergyConsumption &&
    !!firstCompliancePeriodDetails.organisationalEnergyConsumption;

  const isSignificantEnergyConsumptionDetailsCompleted = () => {
    const organisationalEnergyConsumption = firstCompliancePeriodDetails?.organisationalEnergyConsumption;
    const significantEnergyConsumption = firstCompliancePeriodDetails?.significantEnergyConsumption;

    if (firstCompliancePeriodDetails?.significantEnergyConsumptionExists === false) {
      return true;
    }
    if (firstCompliancePeriodDetails?.significantEnergyConsumptionExists && significantEnergyConsumption) {
      const pct = getSignificantPercentage(organisationalEnergyConsumption.total, significantEnergyConsumption?.total);
      return pct !== null && pct >= 95 && pct <= 100 && !!significantEnergyConsumption;
    }
    return false;
  };

  const isPotentialReductionCompleted =
    firstCompliancePeriodDetails?.potentialReductionExists === false ||
    (firstCompliancePeriodDetails?.potentialReductionExists === true &&
      firstCompliancePeriodDetails?.potentialReduction &&
      !!firstCompliancePeriodDetails.potentialReduction);

  return (
    informationExists &&
    isOrganisationalEnergyConsumptionDetailsCompleted &&
    isSignificantEnergyConsumptionDetailsCompleted() &&
    isPotentialReductionCompleted
  );
};
