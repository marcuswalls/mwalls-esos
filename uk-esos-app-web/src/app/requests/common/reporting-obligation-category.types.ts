export type EnergyResponsibleReportingObligationCategory =
  | 'ESOS_ENERGY_ASSESSMENTS_95_TO_100'
  | 'ISO_50001_COVERING_ENERGY_USAGE'
  | 'PARTIAL_ENERGY_ASSESSMENTS'
  | 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100';

export type QualifiedReportingObligationCategory =
  | EnergyResponsibleReportingObligationCategory
  | 'ZERO_ENERGY'
  | 'LESS_THAN_40000_KWH_PER_YEAR';

export type ReportingObligationCategory = QualifiedReportingObligationCategory | 'NOT_QUALIFY';
