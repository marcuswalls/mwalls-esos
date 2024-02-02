package uk.gov.esos.api.reporting.noc.phase3.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NocP3ReportingObligationCategoryDeterminationServiceTest {

    private final NocP3ReportingObligationCategoryDeterminationService service = new NocP3ReportingObligationCategoryDeterminationService();

    @Test
    void determineReportingObligationCategory_when_no_need_to_qualify() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.NOT_QUALIFY)
            .build();

        ReportingObligationCategory actualCategory = service.determineReportingObligationCategory(reportingObligation);

        assertEquals(ReportingObligationCategory.NOT_QUALIFY, actualCategory);
    }

    @Test
    void determineReportingObligationCategory_when_qualify_and_no_energy_responsible() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.QUALIFY)
            .reportingObligationDetails(ReportingObligationDetails.builder()
                .energyResponsibilityType(OrganisationEnergyResponsibilityType.NOT_RESPONSIBLE)
                .build())
            .build();

        ReportingObligationCategory actualCategory = service.determineReportingObligationCategory(reportingObligation);

        assertEquals(ReportingObligationCategory.ZERO_ENERGY, actualCategory);
    }

    @Test
    void determineReportingObligationCategory_when_qualify_and_responsible_less_than_40000() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.QUALIFY)
            .reportingObligationDetails(ReportingObligationDetails.builder()
                .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE_BUT_LESS_THAN_40000_KWH)
                .build())
            .build();

        ReportingObligationCategory actualCategory = service.determineReportingObligationCategory(reportingObligation);

        assertEquals(ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR, actualCategory);
    }

    @ParameterizedTest()
    @MethodSource("provideComplianceRouteDistributionValues")
    void determineReportingObligationCategory_when_qualify_and_responsible(ComplianceRouteDistribution complianceRouteDistribution,
                                                                           ReportingObligationCategory expectedCategory) {

        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.QUALIFY)
            .reportingObligationDetails(ReportingObligationDetails.builder()
                .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE)
                .complianceRouteDistribution(complianceRouteDistribution)
                .build())
            .build();

        ReportingObligationCategory actualCategory = service.determineReportingObligationCategory(reportingObligation);

        assertEquals(expectedCategory, actualCategory);
    }

    private static Stream<Arguments> provideComplianceRouteDistributionValues() {
        return Stream.of(
            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(100)
                    .greenDealAssessmentPct(0)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(0)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(0)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(99)
                    .energyNotAuditedPct(1)
                    .build(),
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(0)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(100)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(90)
                    .greenDealAssessmentPct(0)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(10)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(10)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(90)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(20)
                    .greenDealAssessmentPct(20)
                    .displayEnergyCertificatePct(20)
                    .energyAuditsPct(40)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(30)
                    .displayEnergyCertificatePct(20)
                    .energyAuditsPct(45)
                    .energyNotAuditedPct(5)
                    .build(),
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(100)
                    .displayEnergyCertificatePct(0)
                    .energyAuditsPct(0)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(0)
                    .displayEnergyCertificatePct(100)
                    .energyAuditsPct(0)
                    .energyNotAuditedPct(0)
                    .build(),
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100),

            Arguments.of(ComplianceRouteDistribution.builder()
                    .iso50001Pct(0)
                    .greenDealAssessmentPct(55)
                    .displayEnergyCertificatePct(43)
                    .energyAuditsPct(0)
                    .energyNotAuditedPct(2)
                    .build(),
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100)
        );
    }
}