package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class OtherProcessEnergyIntensityRatioDetails extends EnergyIntensityRatioDetails {

    @NotBlank
    @Size(max = 255)
    private String name;
}
