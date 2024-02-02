package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergySavingsOpportunities implements NocP3Section {

    @NotNull
    @Valid
    private EnergyConsumption energyConsumption;

    @NotNull
    @Valid
    private EnergySavingsCategories energySavingsCategories;

}
