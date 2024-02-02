package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(T(java.util.stream.IntStream).of(#energyManagementPractices, #behaviourChangeInterventions, #training, #controlsImprovements, " +
        "#shortTermCapitalInvestments, #longTermCapitalInvestments, #otherMeasures).sum() == #total.intValue())}",
        message = "noc.energysavingscategories.sum")
public class EnergySavingsCategories {

    @NotNull
    @Min(0)
    private Integer energyManagementPractices;

    @NotNull
    @Min(0)
    private Integer behaviourChangeInterventions;

    @NotNull
    @Min(0)
    private Integer training;

    @NotNull
    @Min(0)
    private Integer controlsImprovements;

    @NotNull
    @Min(0)
    private Integer shortTermCapitalInvestments;

    @NotNull
    @Min(0)
    private Integer longTermCapitalInvestments;

    @NotNull
    @Min(0)
    private Integer otherMeasures;

    @NotNull
    @PositiveOrZero
    private Integer total;
}
