package uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriodDetails;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SecondCompliancePeriodTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_no_informationExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_informationExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.TRUE)
	            .significantEnergyConsumption(buildSignificantEnergyConsumption())
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.TRUE)
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchievedExists(Boolean.TRUE)
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_informationExists_nothing_else_exists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.FALSE)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.FALSE)
	            .build())
            .reductionAchievedExists(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_no_informationExists_anything_else_exists_invalid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.FALSE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.TRUE)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.FALSE)
	            .build())
            .reductionAchievedExists(Boolean.TRUE)
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
        		"{noc.complianceperiod.reductionAchievedExists}",
        	    "{noc.complianceperiod.energyconsumption.details}",
        	    "{noc.complianceperiod.significantEnergyConsumption}");
    }
    
    @Test
    void validate_when_no_significantEnergyConsumptionExists_invalid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.TRUE)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.FALSE)
	            .build())
            .reductionAchievedExists(Boolean.TRUE)
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.complianceperiod.significantEnergyConsumption}");
    }
    
    @Test
    void validate_when_potentialReductionExists_invalid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.FALSE)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.FALSE)
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchievedExists(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.complianceperiod.potentialReduction}");
    }
    
    @Test
    void validate_when_no_reductionAchievedExists_invalid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.FALSE)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.TRUE)
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchievedExists(Boolean.FALSE)
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.complianceperiod.reductionAchieved}");
    }
    
    @Test
    void validate_when_significantEnergyConsumptionPct_not_correct_invalid() {
    	SignificantEnergyConsumption sec = buildSignificantEnergyConsumption();
    	sec.setSignificantEnergyConsumptionPct(95);
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(Boolean.TRUE)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumption(buildEnergyConsumption())
	            .significantEnergyConsumptionExists(Boolean.TRUE)
	            .significantEnergyConsumption(sec)
	            .explanation("explanation")
	            .potentialReductionExists(Boolean.TRUE)
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchievedExists(Boolean.FALSE)
            .reductionAchieved(null)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.complianceperiod.significantEnergyConsumptionPct}");
    }

	private SignificantEnergyConsumption buildSignificantEnergyConsumption() {
		return SignificantEnergyConsumption.builder()
				.buildings(100)
				.transport(100)
				.industrialProcesses(100)
				.otherProcesses(95)
				.total(395)
				.significantEnergyConsumptionPct(98)
				.build();
	}

	private EnergyConsumption buildEnergyConsumption() {
		return EnergyConsumption.builder()
				.buildings(100)
				.transport(100)
				.industrialProcesses(100)
				.otherProcesses(100)
				.total(400)
				.build();
	}
}
