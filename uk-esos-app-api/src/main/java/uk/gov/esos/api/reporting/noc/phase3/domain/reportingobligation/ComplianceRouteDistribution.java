package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#iso50001Pct != null && #displayEnergyCertificatePct != null && #greenDealAssessmentPct != null && #energyAuditsPct != null && #energyNotAuditedPct != null) " +
    "&& (T(java.util.stream.IntStream).of(#iso50001Pct, #displayEnergyCertificatePct, #greenDealAssessmentPct, #energyAuditsPct, #energyNotAuditedPct).sum() == 100)}",
    message = "noc.complianceRouteDistribution.sum")
public class ComplianceRouteDistribution {

    @NotNull
    @Min(0)
    @Max(100)
    private Integer iso50001Pct;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer displayEnergyCertificatePct;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer greenDealAssessmentPct;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer energyAuditsPct;

    @NotNull
    @Min(0)
    @Max(5)
    private Integer energyNotAuditedPct;

    @NotNull
    @Min(100)
    @Max(100)
    private Integer totalPct;
}
