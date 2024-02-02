package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#areDataEstimated) == (#areEstimationMethodsRecordedInEvidencePack != null)}", 
message = "noc.complianceroute.areEstimationMethodsRecordedInEvidencePack")
@SpELExpression(expression = "{(#energyConsumptionProfilingUsed eq 'YES') == (#areEnergyConsumptionProfilingMethodsRecorded != null)}", 
message = "noc.complianceroute.areEnergyConsumptionProfilingMethodsRecorded")
@SpELExpression(expression = "{(#energyConsumptionProfilingUsed eq 'NO' || #energyConsumptionProfilingUsed eq 'NOT_APPLICABLE') || (#energyAudits.isEmpty())}", 
message = "noc.complianceroute.energyAudits")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#partsProhibitedFromDisclosingExist) == (#partsProhibitedFromDisclosing != null)}", 
message = "noc.complianceroute.partsProhibitedFromDisclosing")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#partsProhibitedFromDisclosingExist) == (#partsProhibitedFromDisclosingReason != null)}", 
message = "noc.complianceroute.partsProhibitedFromDisclosingReason")
public class ComplianceRoute implements NocP3Section {

	@NotNull
	private Boolean areDataEstimated;
	
	private Boolean areEstimationMethodsRecordedInEvidencePack;
	
	private TwelveMonthsVerifiableData twelveMonthsVerifiableDataUsed;
	
	private EnergyConsumptionProfiling energyConsumptionProfilingUsed;
	
	private Boolean areEnergyConsumptionProfilingMethodsRecorded;
	
	@Valid
    @Builder.Default
	private List<EnergyAudit> energyAudits = new ArrayList<>();
	
	@NotNull
	private Boolean partsProhibitedFromDisclosingExist;
	
    @Size(max = 10000)
	private String partsProhibitedFromDisclosing;
	
    @Size(max = 10000)
	private String partsProhibitedFromDisclosingReason;
}
