export const COMPLIANCE_ROUTE_SUB_TASK = 'complianceRoute';

export enum CurrentStep {
  DATA_ESTIMATED = 'dataEstimated',
  ESTIMATION_METHODS_RECORDED = 'estimationMethodsRecorded',
  TWELVE_MONTHS_VERIFIABLE_DATA = 'twelveMonthsVerifiableData',
  ENERGY_CONSUMPTION_PROFILING = 'energyConsumptionProfiling',
  ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED = 'energyConsumptionProfilingMethodsRecorded',
  ENERGY_AUDITS = 'energyAudits',
  ADD_ENERGY_AUDIT = 'addEnergyAudit',
  EDIT_ENERGY_AUDIT = 'editEnergyAudit',
  REMOVE_ENERGY_AUDIT = 'removeEnergyAudit',
  REMOVE_ENERGY_AUDIT_SUMMARY = 'removeEnergyAuditSummary',
  PROHIBITED_DISCLOSING = 'prohibitedDisclosing',
  PROHIBITED_DISCLOSING_PARTS = 'prohibitedDisclosingParts',
  PROHIBITED_DISCLOSING_REASON = 'prohibitedDisclosingReason',
  SUMMARY = 'summary',
}

export enum WizardStep {
  DATA_ESTIMATED = 'data-estimated',
  ESTIMATION_METHODS_RECORDED = 'estimation-methods-recorded',
  TWELVE_MONTHS_VERIFIABLE_DATA = 'twelve-months-verifiable-data',
  ENERGY_CONSUMPTION_PROFILING = 'energy-consumption-profiling',
  ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED = 'energy-consumption-profiling-methods-recorded',
  ENERGY_AUDITS = 'energy-audits',
  ADD_ENERGY_AUDIT = 'add-energy-audit',
  EDIT_ENERGY_AUDIT = 'edit-energy-audit',
  PROHIBITED_DISCLOSING = 'prohibited-disclosing',
  PROHIBITED_DISCLOSING_PARTS = 'prohibited-disclosing-parts',
  PROHIBITED_DISCLOSING_REASON = 'prohibited-disclosing-reason',
  SUMMARY = '../',
}
