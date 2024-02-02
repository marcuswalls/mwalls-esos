package uk.gov.esos.api.reporting.noc.phase3.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.stream.Stream;

@Validated
@Service
public class NocP3ReportingObligationCategoryDeterminationService {

    public ReportingObligationCategory determineReportingObligationCategory(@NotNull @Valid ReportingObligation reportingObligation) {
        OrganisationQualificationType qualificationType = reportingObligation.getQualificationType();

        return switch (qualificationType) {
            case NOT_QUALIFY -> ReportingObligationCategory.NOT_QUALIFY;
            case QUALIFY -> determineQualifiedReportingObligationCategory(reportingObligation.getReportingObligationDetails());
        };
    }

    private ReportingObligationCategory determineQualifiedReportingObligationCategory(ReportingObligationDetails reportingObligationDetails) {
        OrganisationEnergyResponsibilityType energyResponsibilityType = reportingObligationDetails.getEnergyResponsibilityType();
        ComplianceRouteDistribution complianceRouteDistribution = reportingObligationDetails.getComplianceRouteDistribution();

        return switch (energyResponsibilityType) {
            case NOT_RESPONSIBLE -> ReportingObligationCategory.ZERO_ENERGY;
            case RESPONSIBLE_BUT_LESS_THAN_40000_KWH -> ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;
            case RESPONSIBLE  ->  determineEnergyResponsibleReportingObligationCategory(complianceRouteDistribution);
        };
    }

    private ReportingObligationCategory determineEnergyResponsibleReportingObligationCategory(ComplianceRouteDistribution complianceRouteDistribution) {
        Integer iso50001Pct = complianceRouteDistribution.getIso50001Pct();
        Integer displayEnergyCertificatePct = complianceRouteDistribution.getDisplayEnergyCertificatePct();
        Integer greenDealAssessmentPct = complianceRouteDistribution.getGreenDealAssessmentPct();
        Integer energyAuditsPct = complianceRouteDistribution.getEnergyAuditsPct();

        if(isAtLeastOneValueGreaterThanZero(iso50001Pct, displayEnergyCertificatePct, greenDealAssessmentPct)) {
            if(isValueEqualsTo100(iso50001Pct)) {
                return ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;
            }
            if(isValueGreaterThanZero(energyAuditsPct)) {
                return ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;
            } else {
                return ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;
            }
        } else{
            return ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;
        }
    }

    private boolean isValueEqualsTo100(Integer value) {
        return value.compareTo(100) == 0;
    }

    private boolean isAtLeastOneValueGreaterThanZero(Integer... values) {
        return Stream.of(values).anyMatch(this::isValueGreaterThanZero);
    }

    private boolean isValueGreaterThanZero(Integer value) {
        return value.compareTo(0) > 0;
    }
}
