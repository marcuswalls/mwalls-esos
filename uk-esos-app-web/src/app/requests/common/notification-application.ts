import { NocP3 } from 'esos-api';

import { ReportingObligationCategory } from './reporting-obligation-category.types';

export const HIDDEN_SUBTASKS_MAP: Partial<Record<ReportingObligationCategory, (keyof NocP3)[]>> = {
  ESOS_ENERGY_ASSESSMENTS_95_TO_100: ['alternativeComplianceRoutes'],
  ISO_50001_COVERING_ENERGY_USAGE: ['energySavingsOpportunities', 'leadAssessor'],
  LESS_THAN_40000_KWH_PER_YEAR: ['leadAssessor'],
  ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100: ['energySavingsOpportunities'],
  ZERO_ENERGY: [
    'complianceRoute',
    'energyConsumptionDetails',
    'energySavingsOpportunities',
    'alternativeComplianceRoutes',
    'energySavingsAchieved',
    'leadAssessor',
    'assessmentPersonnel',
  ],
  PARTIAL_ENERGY_ASSESSMENTS: [],
  NOT_QUALIFY: [
    'responsibleUndertaking',
    'contactPersons',
    'organisationStructure',
    'complianceRoute',
    'energyConsumptionDetails',
    'energySavingsOpportunities',
    'alternativeComplianceRoutes',
    'energySavingsAchieved',
    'leadAssessor',
    'assessmentPersonnel',
    'firstCompliancePeriod',
    'secondCompliancePeriod',
    'confirmations',
  ],
};
