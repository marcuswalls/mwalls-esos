package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#hasOverseasParentDetails) == (#overseasParentDetails != null)}", message = "noc.responsibleUndertaking.hasOverseasParentDetails")
public class ResponsibleUndertaking implements NocP3Section {

    @NotNull
    @Valid
    private ReviewOrganisationDetails organisationDetails;

    @NotNull
    @Valid
    private TradingDetails tradingDetails;

    @NotNull
    @Valid
    private OrganisationContactDetails organisationContactDetails;

    @NotNull
    private Boolean hasOverseasParentDetails;

    @Valid
    private OverseasParentDetails overseasParentDetails;
}
