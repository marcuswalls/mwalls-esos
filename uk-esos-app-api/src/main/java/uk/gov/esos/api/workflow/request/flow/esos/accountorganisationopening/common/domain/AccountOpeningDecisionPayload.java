package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountOpeningDecisionPayload {

    @NotNull(message = "{accountOpeningDecision.decision.notEmpty}")
    private Decision decision;

    @NotBlank(message = "{accountOpeningDecision.reason.notEmpty}")
    @Size(max = 255, message = "{accountOpeningDecision.reason.typeMismatch}")
    private String reason;
}
