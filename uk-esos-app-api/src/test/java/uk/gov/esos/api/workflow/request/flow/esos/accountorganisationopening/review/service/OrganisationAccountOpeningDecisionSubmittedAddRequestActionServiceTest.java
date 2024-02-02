package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningDecisionSubmittedRequestActionPayload;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningDecisionSubmittedAddRequestActionServiceTest {

    @InjectMocks
    private OrganisationAccountOpeningDecisionSubmittedAddRequestActionService service;

    @Mock
    private RequestService requestService;

    @Test
    void addRequestAction() {
        String requestId = "id";
        String regulatorUser = "regulatorUser";
        AccountOpeningDecisionPayload decision = AccountOpeningDecisionPayload.builder()
            .decision(Decision.APPROVED)
            .reason("reason")
            .build();

        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .account(OrganisationAccountPayload.builder().build())
            .decision(decision)
            .participantDetails(OrganisationParticipantDetails.builder().build())
            .regulatorAssignee(regulatorUser)
            .build();

        Request request = Request.builder().id(requestId).payload(requestPayload).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        //invoke
        service.addRequestAction(requestId);

        //verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestService, times(1)).addActionToRequest(
            eq(request),
            any(OrganisationAccountOpeningDecisionSubmittedRequestActionPayload.class),
            eq(RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED),
            eq(regulatorUser));
    }
}