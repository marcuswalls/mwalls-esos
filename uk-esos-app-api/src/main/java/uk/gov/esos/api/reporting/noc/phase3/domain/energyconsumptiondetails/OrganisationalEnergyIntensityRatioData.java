package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganisationalEnergyIntensityRatioData {

    @NotNull
    @Valid
    private EnergyIntensityRatioDetails buildingsIntensityRatio;

    @NotNull
    @Valid
    private EnergyIntensityRatio freightsIntensityRatio;

    @NotNull
    @Valid
    private EnergyIntensityRatioDetails passengersIntensityRatio;

    @NotNull
    @Valid
    private EnergyIntensityRatioDetails industrialProcessesIntensityRatio;

    @Valid
    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<OtherProcessEnergyIntensityRatioDetails> otherProcessesIntensityRatios = new ArrayList<>();
}
