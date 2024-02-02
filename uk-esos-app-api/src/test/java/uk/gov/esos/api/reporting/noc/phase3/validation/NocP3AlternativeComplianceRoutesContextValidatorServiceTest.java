package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.AlternativeComplianceRoutes;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.Assets;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.CertificateDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.CertificatesDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3AlternativeComplianceRoutesContextValidatorServiceTest {

	@InjectMocks
    private NocP3AlternativeComplianceRoutesContextValidatorService contextValidator;

	@Mock
	private NocSectionConstraintValidatorService<AlternativeComplianceRoutes> nocSectionConstraintValidatorService;

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(10000)
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.iso50001CertificateDetails(CertificateDetails.builder()
				.certificateNumber("cert number")
				.validFrom(LocalDate.now().minusDays(1))
				.validUntil(LocalDate.now().plusDays(1))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_totalEnergyConsumptionReduction_not_exists_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.iso50001CertificateDetails(CertificateDetails.builder()
				.certificateNumber("cert number")
				.validFrom(LocalDate.now().minusDays(1))
				.validUntil(LocalDate.now().plusDays(1))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }
    
    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_gda_dec_exist_iso50001_not_exist_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(10000)
			.assets(Assets.builder()
				.dec("dec text")
				.iso50001("aa")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.gdaCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsExactlyInAnyOrder(
        		NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_DEC_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_GDA_DETAILS.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }
    
    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_valid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(EnergyConsumption.builder()
				.buildings(10)
				.transport(10)
				.industrialProcesses(10)
				.otherProcesses(10)
				.total(40)
				.build())
			.energyConsumptionReductionCategories(EnergySavingsCategories.builder()
				.energyManagementPractices(10)
				.behaviourChangeInterventions(0)
				.controlsImprovements(10)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(10)
				.training(10)
				.otherMeasures(0)
				.total(40)
				.build())
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(0)
                								.displayEnergyCertificatePct(1)
                								.greenDealAssessmentPct(0)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }

    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_totalEnergyConsumptionReduction_exists_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(EnergyConsumption.builder()
				.buildings(10)
				.transport(10)
				.industrialProcesses(10)
				.otherProcesses(10)
				.total(40)
				.build())
			.energyConsumptionReductionCategories(EnergySavingsCategories.builder()
				.energyManagementPractices(10)
				.behaviourChangeInterventions(0)
				.controlsImprovements(10)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(10)
				.training(10)
				.otherMeasures(0)
				.total(40)
				.build())
			.totalEnergyConsumptionReduction(1000)
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(0)
                								.displayEnergyCertificatePct(1)
                								.greenDealAssessmentPct(0)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }
    
    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_wrong_certificates_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(EnergyConsumption.builder()
				.buildings(10)
				.transport(10)
				.industrialProcesses(10)
				.otherProcesses(10)
				.total(40)
				.build())
			.energyConsumptionReductionCategories(EnergySavingsCategories.builder()
				.energyManagementPractices(10)
				.behaviourChangeInterventions(0)
				.controlsImprovements(10)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(10)
				.training(10)
				.otherMeasures(0)
				.total(40)
				.build())
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.gdaCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(5)
                								.displayEnergyCertificatePct(0)
                								.greenDealAssessmentPct(5)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsExactlyInAnyOrder(
        		NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_DEC_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_GDA_DETAILS.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
    }

	@Test
	void validate_PARTIAL_ENERGY_ASSESSMENTS_invalid_reporting_obligation_data() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(EnergyConsumption.builder()
				.buildings(10)
				.transport(10)
				.industrialProcesses(10)
				.otherProcesses(10)
				.total(40)
				.build())
			.energyConsumptionReductionCategories(EnergySavingsCategories.builder()
				.energyManagementPractices(10)
				.behaviourChangeInterventions(0)
				.controlsImprovements(10)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(10)
				.training(10)
				.otherMeasures(0)
				.total(40)
				.build())
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
		final NocP3Container nocP3Container = NocP3Container.builder()
			.noc(NocP3.builder()
				.reportingObligation(ReportingObligation.builder().build())
				.alternativeComplianceRoutes(alternativeComplianceRoutes)
				.build())
			.build();
		final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

		// Invoke
		NocValidationResult result = contextValidator.validate(nocP3Container, category);

		// Verify
		assertThat(result.isValid()).isFalse();
		assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsOnly(
			NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
	}
    
    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories()).containsExactlyInAnyOrder(
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
}
