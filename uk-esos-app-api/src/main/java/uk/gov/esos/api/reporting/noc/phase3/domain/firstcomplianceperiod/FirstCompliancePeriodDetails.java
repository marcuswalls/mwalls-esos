package uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) == (#significantEnergyConsumption != null)}",
		message = "noc.complianceperiod.significantEnergyConsumption")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#potentialReductionExists) == (#potentialReduction != null)}",
		message = "noc.complianceperiod.potentialReduction")
@SpELExpression(expression = "{(#significantEnergyConsumption?.total == null || #organisationalEnergyConsumption?.total == null || #significantEnergyConsumption?.significantEnergyConsumptionPct == null) " + 
			"|| (T(java.lang.Math).floor(#significantEnergyConsumption.total * 100.0 / #organisationalEnergyConsumption.total) == #significantEnergyConsumption.significantEnergyConsumptionPct)} ",
			message = "noc.complianceperiod.significantEnergyConsumptionPct")
public class FirstCompliancePeriodDetails {

	@NotNull
	@Valid
	private EnergyConsumption organisationalEnergyConsumption;
	
	@NotNull
	private Boolean significantEnergyConsumptionExists;
	
	@Valid
	private SignificantEnergyConsumption significantEnergyConsumption;
	
	@Size(max = 10000)
	private String explanation;
	
	@NotNull
	private Boolean potentialReductionExists;
	
	@Valid
	private EnergyConsumption potentialReduction;
}
