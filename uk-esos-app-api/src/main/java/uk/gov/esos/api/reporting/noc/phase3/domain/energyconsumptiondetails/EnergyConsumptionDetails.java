package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) == (#significantEnergyConsumption != null)}",
    message = "noc.energyConsumptionDetails.significantEnergyConsumption.exist")
@SpELExpression(expression = "{(#totalEnergyConsumption?.total == null || #significantEnergyConsumption?.total == null || #significantEnergyConsumption?.significantEnergyConsumptionPct == null) " +
    "|| (T(java.lang.Math).floor(#significantEnergyConsumption.total * 100.0 / #totalEnergyConsumption.total) == #significantEnergyConsumption.significantEnergyConsumptionPct)} ",
    message = "noc.energyConsumptionDetails.significantEnergyConsumptionPct")
@SpELExpression(expression = "{(#totalEnergyConsumption?.total == null || #totalEnergyConsumption.total > 0)} ",
    message = "noc.energyConsumptionDetails.totalEnergyConsumption.total")
@SpELExpression(expression = "{(#significantEnergyConsumption?.total == null || #significantEnergyConsumption.total > 0)} ",
    message = "noc.energyConsumptionDetails.significantEnergyConsumption.total")

@SpELExpression(expression = "{(#totalEnergyConsumption?.buildings == null || #significantEnergyConsumption?.buildings == null) " +
    "|| (#significantEnergyConsumption.buildings.compareTo(#totalEnergyConsumption.buildings) <= 0)} ", message = "noc.energyConsumptionDetails.buildings")
@SpELExpression(expression = "{(#totalEnergyConsumption?.transport == null || #significantEnergyConsumption?.transport == null) " +
    "|| (#significantEnergyConsumption.transport.compareTo(#totalEnergyConsumption.transport) <= 0)} ", message = "noc.energyConsumptionDetails.transport")
@SpELExpression(expression = "{(#totalEnergyConsumption?.industrialProcesses == null || #significantEnergyConsumption?.industrialProcesses == null) " +
    "|| (#significantEnergyConsumption.industrialProcesses.compareTo(#totalEnergyConsumption.industrialProcesses) <= 0)} ", message = "noc.energyConsumptionDetails.industrialProcesses")
@SpELExpression(expression = "{(#totalEnergyConsumption?.otherProcesses == null || #significantEnergyConsumption?.otherProcesses == null) " +
    "|| (#significantEnergyConsumption.otherProcesses.compareTo(#totalEnergyConsumption.otherProcesses) <= 0)} ", message = "noc.energyConsumptionDetails.otherProcesses")

@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#additionalInformationExists) == (#additionalInformation != null)}",
    message = "noc.energyConsumptionDetails.additionalInformation.exist")
public class EnergyConsumptionDetails implements NocP3Section {

    @NotNull
    @Valid
    private EnergyConsumption totalEnergyConsumption;

    @NotNull
    private Boolean significantEnergyConsumptionExists;

    @Valid
    private SignificantEnergyConsumption significantEnergyConsumption;

    @Valid
    @NotNull
    private OrganisationalEnergyIntensityRatioData energyIntensityRatioData;

    @NotNull
    private Boolean additionalInformationExists;

    @Size(max = 10000)
    private String additionalInformation;
}
