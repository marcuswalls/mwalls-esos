package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrganisationAccountOpeningApplicationRequestTaskPayload extends RequestTaskPayload {

    private OrganisationAccountPayload account;

    private OrganisationParticipantDetails participantDetails;
}
