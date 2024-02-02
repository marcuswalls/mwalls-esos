package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload extends RequestTaskActionPayload {

    @JsonUnwrapped
    @Valid
    @NotNull
    private AccountOpeningDecisionPayload decision;
}
