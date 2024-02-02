package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OverseasParentDetails {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String tradingName;
}
