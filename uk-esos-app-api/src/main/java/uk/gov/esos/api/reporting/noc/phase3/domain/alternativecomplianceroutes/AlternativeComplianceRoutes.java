package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#energyConsumptionReduction?.total == null || #energyConsumptionReductionCategories?.total == null " + 
		"|| #energyConsumptionReduction.total == #energyConsumptionReductionCategories.total)} ", 
		message = "noc.energyconsumption.totals.equal")
@SpELExpression(expression = "{(#energyConsumptionReduction?.total == null || #energyConsumptionReduction.total > 0)} ", 
		message = "noc.energyconsumption.total")
@SpELExpression(expression = "{(#energyConsumptionReductionCategories?.total == null || #energyConsumptionReductionCategories.total > 0)} ", 
		message = "noc.energyconsumption.total")
public class AlternativeComplianceRoutes implements NocP3Section {

	@Positive
	private Integer totalEnergyConsumptionReduction;
	
	@Valid
	private EnergyConsumption energyConsumptionReduction;
	
	@Valid
	private EnergySavingsCategories energyConsumptionReductionCategories;
	
	@Valid
	private Assets assets;
	
	@Valid
	private CertificateDetails iso50001CertificateDetails;
	
	@Valid
	private CertificatesDetails decCertificatesDetails;
	
	@Valid
	private CertificatesDetails gdaCertificatesDetails;
}
