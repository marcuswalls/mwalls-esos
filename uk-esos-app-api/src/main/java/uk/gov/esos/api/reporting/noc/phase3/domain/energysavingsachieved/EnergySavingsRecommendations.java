package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

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
@SpELExpression(expression = "{(T(java.util.stream.IntStream).of(#energyAudits, #alternativeComplianceRoutes, #other).sum() == 100)}",
        message = "noc.energysavingsachieved.energySavingsRecommendations.sum")
public class EnergySavingsRecommendations {

    @NotNull
    @Min(0)
    @Max(100)
    private Integer energyAudits;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer alternativeComplianceRoutes;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer other;

    @NotNull
    @Min(100)
    @Max(100)
    private Integer total;

}
