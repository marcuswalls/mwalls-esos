package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningDecisionSubmittedRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.mapper.OrganisationAccountOpeningReviewMapper;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningDecisionSubmittedAddRequestActionService {

    private final RequestService requestService;
    private static final OrganisationAccountOpeningReviewMapper ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER = Mappers.getMapper(OrganisationAccountOpeningReviewMapper.class);

    public void addRequestAction(String requestId) {
        Request request = requestService.findRequestById(requestId);
        OrganisationAccountOpeningRequestPayload requestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();

        AccountOpeningDecisionPayload decision = requestPayload.getDecision();
        boolean isApplicationApproved = decision.getDecision() == Decision.APPROVED;

        OrganisationAccountOpeningDecisionSubmittedRequestActionPayload requestActionPayload =
            ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER.toOrganisationAccountOpeningDecisionSubmittedRequestActionPayload(requestPayload);

        requestService.addActionToRequest(
            request,
            requestActionPayload,
            isApplicationApproved ? RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED : RequestActionType.ORGANISATION_ACCOUNT_OPENING_REJECTED,
            requestPayload.getRegulatorAssignee());
    }
}
