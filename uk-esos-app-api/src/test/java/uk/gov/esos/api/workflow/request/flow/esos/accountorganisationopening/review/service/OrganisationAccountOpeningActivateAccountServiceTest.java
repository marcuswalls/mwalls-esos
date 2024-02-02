package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountActivationService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningActivateAccountService;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningActivateAccountServiceTest {

    @InjectMocks
    private OrganisationAccountOpeningActivateAccountService organisationAccountOpeningActivateAccountService;

    @Mock
    private RequestService requestService;

    @Mock
    private OrganisationAccountActivationService organisationAccountActivationService;

    @Test
    void execute() {
        //prepare data
        final String requestId = "1";
        final Long accountId = 1L;
        final String assignee = "user";

        final OrganisationAccountPayload accountPayload = new OrganisationAccountPayload();

        final Request request = Request.builder()
            .id(requestId)
            .accountId(accountId)
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .payloadType(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)
                .account(accountPayload)
                .operatorAssignee(assignee)
                .build())
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        //invoke
        organisationAccountOpeningActivateAccountService.execute(requestId);

        //verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(organisationAccountActivationService, times(1)).activateAccount(accountId, assignee);
    }
}
