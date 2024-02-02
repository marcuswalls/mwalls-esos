package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrganisationAccountOpeningRequestPayload extends RequestPayload {

    private OrganisationParticipantDetails participantDetails;

    private OrganisationAccountPayload account;

    private AccountOpeningDecisionPayload decision;
}
