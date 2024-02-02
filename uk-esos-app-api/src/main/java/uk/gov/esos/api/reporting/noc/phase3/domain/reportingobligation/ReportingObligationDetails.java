package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#energyResponsibilityType ne 'NOT_RESPONSIBLE') == (#complianceRouteDistribution != null)}",
    message = "noc.reportingObligationDetails.energyResponsibilityType.complianceRouteDistribution")
public class ReportingObligationDetails {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    @NotEmpty
    private Set<OrganisationQualificationReasonType> qualificationReasonTypes = new HashSet<>();

    @NotNull
    private OrganisationEnergyResponsibilityType energyResponsibilityType;

    @Valid
    private ComplianceRouteDistribution complianceRouteDistribution;
}
