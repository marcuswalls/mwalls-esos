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
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsAchieved;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsRecommendations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3EnergySavingsAchievedContextValidatorServiceTest {

    @InjectMocks
    private NocP3EnergySavingsAchievedContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<EnergySavingsAchieved> nocSectionConstraintValidatorService;

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_categories_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
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
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_categories_not_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
                .build())
            .energySavingCategoriesExist(Boolean.FALSE)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .totalEnergySavingsEstimation(150)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_estimation_categories_not_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_total_estimation_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
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
            .totalEnergySavingsEstimation(150)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_estimation_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
                .build())
            .energySavingCategoriesExist(Boolean.FALSE)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_invalid_totals() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
                .build())
            .energySavingCategoriesExist(Boolean.TRUE)
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10)
                .behaviourChangeInterventions(20)
                .training(30)
                .controlsImprovements(40)
                .shortTermCapitalInvestments(50)
                .longTermCapitalInvestments(40)
                .otherMeasures(30)
                .total(220)
                .build())
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION_ENERGY_SAVINGS_CATEGORIES_TOTAL.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_estimation_categories_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30)
                .transport(20)
                .industrialProcesses(100)
                .otherProcesses(50)
                .total(200)
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
            .totalEnergySavingsEstimation(150)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_categories_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_categories_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
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
            .totalEnergySavingsEstimation(150)
            .energySavingsRecommendationsExist(Boolean.TRUE)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }
}

