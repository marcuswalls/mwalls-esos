package uk.gov.esos.api.reporting.noc.phase3.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class EnergyConsumptionTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_everything_valid() {
    	EnergyConsumption ec = buildEnergyConsumption();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_total_not_correct_invalid() {
    	EnergyConsumption ec = buildEnergyConsumption();
    	ec.setTotal(399);

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.energyconsumption.sum}");
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
