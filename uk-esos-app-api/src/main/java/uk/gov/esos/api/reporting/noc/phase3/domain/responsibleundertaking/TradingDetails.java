package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

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
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#exist) == (#tradingName != null)}", message = "noc.tradingDetails.exist")
public class TradingDetails {

    @NotNull
    private Boolean exist;

    @Size(max = 255)
    private String tradingName;
}
