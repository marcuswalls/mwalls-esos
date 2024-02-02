package uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriod;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#informationExists) == (#reductionAchievedExists != null)}",
message = "noc.complianceperiod.reductionAchievedExists")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#reductionAchievedExists) == (#reductionAchieved != null)}",
message = "noc.complianceperiod.reductionAchieved")
public class SecondCompliancePeriod extends FirstCompliancePeriod {
	
	private Boolean reductionAchievedExists;
	
	@Valid
	private EnergyConsumption reductionAchieved;	
}
