package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergyConsumptionDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45)
            .transport(46)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(191)
            .significantEnergyConsumptionPct(95)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(true)
            .additionalInformation("info")
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_invalid_additional_information_should_not_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .additionalInformation("information")
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.additionalInformation.exist}");
    }


    @Test
    void validate_invalid_additional_information_should_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(true)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.additionalInformation.exist}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_should_not_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45)
            .transport(45)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(190)
            .significantEnergyConsumptionPct(95)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.significantEnergyConsumption.exist}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_should_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.significantEnergyConsumption.exist}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_pct_is_wrong() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45)
            .transport(45)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(190)
            .significantEnergyConsumptionPct(98)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.significantEnergyConsumptionPct}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_values_bigger_than_energy_consumption() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(60)
            .transport(60)
            .industrialProcesses(60)
            .otherProcesses(10)
            .total(190)
            .significantEnergyConsumptionPct(95)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.buildings}",
            "{noc.energyConsumptionDetails.transport}",
            "{noc.energyConsumptionDetails.industrialProcesses}");
    }

    @Test
    void validate_invalid_when_consumption_total_not_bigger_than_zero() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(0)
            .transport(0)
            .industrialProcesses(0)
            .otherProcesses(0)
            .total(0)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.totalEnergyConsumption.total}");
    }

    @Test
    void validate_invalid_when_significant_consumption_total_not_bigger_than_zero() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50)
            .transport(50)
            .industrialProcesses(50)
            .otherProcesses(50)
            .total(200)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(0)
            .transport(0)
            .industrialProcesses(0)
            .otherProcesses(0)
            .total(0)
            .significantEnergyConsumptionPct(100)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
            .buildingsIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .freightsIntensityRatio(EnergyIntensityRatio.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .passengersIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.ONE).unit("kwh").build())
            .industrialProcessesIntensityRatio(EnergyIntensityRatioDetails.builder().ratio(BigDecimal.TEN).unit("kwh").build())
            .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.significantEnergyConsumption.total}",
            "{noc.energyConsumptionDetails.significantEnergyConsumptionPct}");
    }
}