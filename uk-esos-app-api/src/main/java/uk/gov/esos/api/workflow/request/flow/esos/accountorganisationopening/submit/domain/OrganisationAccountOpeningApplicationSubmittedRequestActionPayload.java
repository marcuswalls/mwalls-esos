package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrganisationAccountOpeningApplicationSubmittedRequestActionPayload extends RequestActionPayload {

    @Valid
    @NotNull
    private OrganisationParticipantDetails participantDetails;

    @Valid
    @NotNull
    private OrganisationAccountPayload account;
}
