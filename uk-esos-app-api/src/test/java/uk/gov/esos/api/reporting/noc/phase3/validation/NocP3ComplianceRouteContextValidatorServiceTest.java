package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.ComplianceRoute;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.EnergyAudit;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.EnergyConsumptionProfiling;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.TwelveMonthsVerifiableData;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3ComplianceRouteContextValidatorServiceTest {

	@InjectMocks
    private NocP3ComplianceRouteContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<ComplianceRoute> nocSectionConstraintValidatorService;

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.FALSE)
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().complianceRoute(complianceRoute).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_twelveMonthsVerifiableDataUsed_exists_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.FALSE)
            .twelveMonthsVerifiableDataUsed(TwelveMonthsVerifiableData.NOT_APPLICABLE)
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().complianceRoute(complianceRoute).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_energy_audits_exist_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.FALSE)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().complianceRoute(complianceRoute).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.TRUE)
            .areEstimationMethodsRecordedInEvidencePack(Boolean.TRUE)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
            .areEnergyConsumptionProfilingMethodsRecorded(Boolean.TRUE)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().complianceRoute(complianceRoute).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_twelveMonthsVerifiableDataUsed_not_exists_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.FALSE)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.NO)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().complianceRoute(complianceRoute).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_TWELVE_MONTHS_VERIFIABLE_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories()).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
    
    private List<EnergyAudit> buildEnergyAudit() {
		return List.of(EnergyAudit.builder()
				.description("desc")
				.numberOfSitesCovered(1)
				.numberOfSitesVisited(2)
				.reason("reason")
				.build());
	}
}
