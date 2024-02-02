import { Confirmations } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';

export const isWizardCompleted = (
  confirmations: Confirmations,
  reportingObligationCategory: ReportingObligationCategory,
  leadAssessorType?: string,
) => {
  const isResponsibilityAssessmentTypesCompleted = !!confirmations?.responsibilityAssessmentTypes;

  const isNoEnergyResponsibilityAssessmentTypesCompleted = !!confirmations?.noEnergyResponsibilityAssessmentTypes;

  const isResponsibleOfficerDetailsCompleted =
    !!confirmations?.responsibleOfficerDetails?.firstName &&
    !!confirmations?.responsibleOfficerDetails?.lastName &&
    !!confirmations?.responsibleOfficerDetails?.jobTitle &&
    !!confirmations?.responsibleOfficerDetails?.email &&
    !!confirmations?.responsibleOfficerDetails?.line1 &&
    !!confirmations?.responsibleOfficerDetails?.city &&
    !!confirmations?.responsibleOfficerDetails?.county &&
    !!confirmations?.responsibleOfficerDetails?.postcode;

  const isReviewAssessmentDateCompleted = !!confirmations?.reviewAssessmentDate;

  const isSecondResponsibleOfficerEnergyTypesCompleted =
    !!confirmations?.secondResponsibleOfficerEnergyTypes ||
    (!leadAssessorType && reportingObligationCategory != 'LESS_THAN_40000_KWH_PER_YEAR') ||
    leadAssessorType === 'EXTERNAL';

  const isSecondResponsibleOfficerDetailsCompleted =
    (!!confirmations?.secondResponsibleOfficerDetails?.firstName &&
      !!confirmations?.secondResponsibleOfficerDetails?.lastName &&
      !!confirmations?.secondResponsibleOfficerDetails?.jobTitle &&
      !!confirmations?.secondResponsibleOfficerDetails?.email &&
      !!confirmations?.secondResponsibleOfficerDetails?.line1 &&
      !!confirmations?.secondResponsibleOfficerDetails?.city &&
      !!confirmations?.secondResponsibleOfficerDetails?.county &&
      !!confirmations?.secondResponsibleOfficerDetails?.postcode) ||
    (!leadAssessorType && reportingObligationCategory != 'LESS_THAN_40000_KWH_PER_YEAR') ||
    leadAssessorType === 'EXTERNAL';

  switch (reportingObligationCategory) {
    case 'ESOS_ENERGY_ASSESSMENTS_95_TO_100':
    case 'PARTIAL_ENERGY_ASSESSMENTS':
    case 'LESS_THAN_40000_KWH_PER_YEAR':
    case 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100':
      return (
        isResponsibilityAssessmentTypesCompleted &&
        isResponsibleOfficerDetailsCompleted &&
        isReviewAssessmentDateCompleted &&
        isSecondResponsibleOfficerEnergyTypesCompleted &&
        isSecondResponsibleOfficerDetailsCompleted
      );

    case 'ISO_50001_COVERING_ENERGY_USAGE':
      return (
        isResponsibilityAssessmentTypesCompleted &&
        isResponsibleOfficerDetailsCompleted &&
        isReviewAssessmentDateCompleted
      );

    case 'ZERO_ENERGY':
      return isNoEnergyResponsibilityAssessmentTypesCompleted && isResponsibleOfficerDetailsCompleted;
  }
};
