package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#qualificationType eq 'NOT_QUALIFY') == (#noQualificationReason != null)}", message = "noc.reportingObligation.qualificationType.noQualificationReason")
@SpELExpression(expression = "{(#qualificationType eq 'QUALIFY') == (#reportingObligationDetails != null)}", message = "noc.reportingObligation.qualificationType.details")
public class ReportingObligation {

    @NotNull
    private OrganisationQualificationType qualificationType;

    @Size(max = 10000)
    private String noQualificationReason;

    @Valid
    private ReportingObligationDetails reportingObligationDetails;

}
