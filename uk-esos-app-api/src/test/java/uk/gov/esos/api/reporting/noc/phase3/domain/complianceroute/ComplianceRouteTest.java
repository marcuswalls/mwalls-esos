package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ComplianceRouteTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_all_true_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.TRUE)
            .areEstimationMethodsRecordedInEvidencePack(Boolean.TRUE)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
            .areEnergyConsumptionProfilingMethodsRecorded(Boolean.TRUE)
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();

        final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_areDataEstimated_false_no_energyConsumptionProfilingUsed_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .areDataEstimated(Boolean.FALSE)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.NO)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();

        final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

        assertThat(violations).isEmpty();
    }

	@Test
    void validate_when_EnergyConsumptionProfiling_twelveMonthsVerifiableDataUsed_are_null_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.FALSE)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

    	final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

    	assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_areEstimationMethodsRecordedInEvidencePack_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.TRUE)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(Boolean.TRUE)
                .partsProhibitedFromDisclosingExist(Boolean.TRUE)
                .partsProhibitedFromDisclosing("test")
                .partsProhibitedFromDisclosingReason("test2")
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.areEstimationMethodsRecordedInEvidencePack}");
    }

    @Test
    void validate_when_areEnergyConsumptionProfilingMethodsRecorded_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.FALSE)
                .twelveMonthsVerifiableDataUsed(TwelveMonthsVerifiableData.NOT_APPLICABLE)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.areEnergyConsumptionProfilingMethodsRecorded}");
    }
    
    @Test
    void validate_when_energyConsumptionProfilingUsed_exists_energy_audits_exist_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.FALSE)
                .twelveMonthsVerifiableDataUsed(TwelveMonthsVerifiableData.NOT_APPLICABLE)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(Boolean.TRUE)
                .energyAudits(buildEnergyAudit())
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.energyAudits}");
    }
    
    @Test
    void validate_when_energyConsumptionProfilingUsed_null_energy_audits_exist_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.FALSE)
                .twelveMonthsVerifiableDataUsed(TwelveMonthsVerifiableData.NOT_APPLICABLE)
                .energyAudits(buildEnergyAudit())
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.energyAudits}");
    }
    
    @Test
    void validate_when_partsProhibitedFromDisclosing_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .areDataEstimated(Boolean.TRUE)
                .areEstimationMethodsRecordedInEvidencePack(Boolean.TRUE)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(Boolean.TRUE)
                .partsProhibitedFromDisclosingExist(Boolean.TRUE)
                .build();
    	
    	final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);
    	
    	assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
        		"{noc.complianceroute.partsProhibitedFromDisclosing}", "{noc.complianceroute.partsProhibitedFromDisclosingReason}");
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
