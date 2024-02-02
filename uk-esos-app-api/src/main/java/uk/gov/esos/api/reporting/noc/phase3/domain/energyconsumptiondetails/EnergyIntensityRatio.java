package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EnergyIntensityRatio {

    @NotNull
    private BigDecimal ratio;

    @NotBlank
    @Size(max = 255)
    private String unit;
}
