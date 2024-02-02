package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergySavingsAchievedTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10)
                        .transport(20)
                        .industrialProcesses(30)
                        .otherProcesses(40)
                        .total(100)
                        .build())
                .energySavingCategoriesExist(Boolean.TRUE)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10)
                        .behaviourChangeInterventions(20)
                        .training(30)
                        .controlsImprovements(40)
                        .shortTermCapitalInvestments(50)
                        .longTermCapitalInvestments(30)
                        .otherMeasures(20)
                        .total(200)
                        .build())
                .energySavingsRecommendationsExist(Boolean.TRUE)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_no_energy_saving_categories_no_recommendations_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10)
                        .transport(20)
                        .industrialProcesses(30)
                        .otherProcesses(40)
                        .total(100)
                        .build())
                .energySavingCategoriesExist(Boolean.FALSE)
                .energySavingsRecommendationsExist(Boolean.FALSE)
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void when_energy_savings_categories_recommendations_false_invalid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10)
                        .transport(20)
                        .industrialProcesses(30)
                        .otherProcesses(40)
                        .total(100)
                        .build())
                .energySavingCategoriesExist(Boolean.FALSE)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10)
                        .behaviourChangeInterventions(20)
                        .training(30)
                        .controlsImprovements(40)
                        .shortTermCapitalInvestments(50)
                        .longTermCapitalInvestments(30)
                        .otherMeasures(20)
                        .total(200)
                        .build())
                .energySavingsRecommendationsExist(Boolean.FALSE)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).hasSize(2);
    }

    @Test
    void validate_energy_saving_categories_recommendations_exist_invalid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10)
                        .transport(20)
                        .industrialProcesses(30)
                        .otherProcesses(40)
                        .total(100)
                        .build())
                .energySavingCategoriesExist(Boolean.TRUE)
                .energySavingsRecommendationsExist(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).hasSize(2);
    }

    @Test
    void validate_noenergy_savings_estimation_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .totalEnergySavingsEstimation(120)
                .energySavingsRecommendationsExist(Boolean.TRUE)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }
}
