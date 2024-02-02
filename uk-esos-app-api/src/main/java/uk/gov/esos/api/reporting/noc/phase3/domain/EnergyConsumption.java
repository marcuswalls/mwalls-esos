package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SpELExpression(expression = "{(#buildings != null && #transport != null && #industrialProcesses != null && #otherProcesses != null) " +
		"&& (T(java.util.stream.IntStream).of(#buildings, #transport, #industrialProcesses, #otherProcesses).sum() == #total)}",
		message = "noc.energyconsumption.sum")
public class EnergyConsumption {

	@NotNull
    @Min(0)
	private Integer buildings;
	
	@NotNull
    @Min(0)
	private Integer transport;
	
	@NotNull
    @Min(0)
	private Integer industrialProcesses;
	
	@NotNull
    @Min(0)
	private Integer otherProcesses;
	
	@NotNull
	@PositiveOrZero
	private Integer total;
}
