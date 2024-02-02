package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;

class AlternativeComplianceRoutesTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_totals_equal_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumption())
            .energyConsumptionReductionCategories(buildEnergySavingsCategories())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_energyConsumptionReductionCategories_is_null_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_only_totalEnergyConsumptionReduction_exists_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .totalEnergyConsumptionReduction(100000)
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_totals_not_equal_invalid() {
    	EnergySavingsCategories esc = buildEnergySavingsCategories();
    	esc.setControlsImprovements(201);
    	esc.setTotal(401);
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumption())
            .energyConsumptionReductionCategories(esc)
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyconsumption.totals.equal}");
    }
    
    @Test
    void validate_when_total_zero_invalid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumptionZeroTotal())
            .energyConsumptionReductionCategories(buildEnergySavingsCategoriesZeroTotal())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("{noc.energyconsumption.total}", "{noc.energyconsumption.total}");
    }
    
    private EnergySavingsCategories buildEnergySavingsCategories() {
		return EnergySavingsCategories.builder()
				.energyManagementPractices(0)
				.behaviourChangeInterventions(0)
				.training(0)
				.controlsImprovements(200)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(0)
				.otherMeasures(200)
				.total(400)
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
	
	private EnergySavingsCategories buildEnergySavingsCategoriesZeroTotal() {
		return EnergySavingsCategories.builder()
				.energyManagementPractices(0)
				.behaviourChangeInterventions(0)
				.training(0)
				.controlsImprovements(0)
				.shortTermCapitalInvestments(0)
				.longTermCapitalInvestments(0)
				.otherMeasures(0)
				.total(0)
				.build();
	}

	private EnergyConsumption buildEnergyConsumptionZeroTotal() {
		return EnergyConsumption.builder()
				.buildings(0)
				.transport(0)
				.industrialProcesses(0)
				.otherProcesses(0)
				.total(0)
				.build();
	}
}
