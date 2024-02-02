package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#energySavingCategoriesExist) == (#energySavingsCategories != null)}",
        message = "noc.energysavingsachieved.energySavingsCategories")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#energySavingsRecommendationsExist) == (#energySavingsRecommendations != null)}",
        message = "noc.energysavingsachieved.energySavingsRecommendations")
public class EnergySavingsAchieved implements NocP3Section {

    @Valid
    private EnergyConsumption energySavingsEstimation;

    private Boolean energySavingCategoriesExist;

    @Valid
    private EnergySavingsCategories energySavingsCategories;

    @Min(0)
    private Integer totalEnergySavingsEstimation;

    @NotNull
    private Boolean energySavingsRecommendationsExist;

    @Valid
    private EnergySavingsRecommendations energySavingsRecommendations;

    @Size(max = 10000)
    private String details;
}
