import { EnergyConsumption } from 'esos-api';

export function getTotalSum(energyConsumption: EnergyConsumption): number {
  return (
    +energyConsumption.buildings +
    +energyConsumption.transport +
    +energyConsumption.industrialProcesses +
    +energyConsumption.otherProcesses
  );
}

export function getSignificantPercentage(
  totalEnergyConsumption: number,
  significantTotalEnergyConsumption: number,
): number {
  return totalEnergyConsumption > 0
    ? Math.floor((significantTotalEnergyConsumption / totalEnergyConsumption) * 100)
    : 0;
}
