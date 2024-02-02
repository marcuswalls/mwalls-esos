package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.testcontainers.shaded.org.bouncycastle.cert.ocsp.Req;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountStatusUpdateService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningRejectAccountServiceTest {

    @InjectMocks
    private OrganisationAccountOpeningRejectAccountService accountOpeningRejectAccountService;

    @Mock
    private RequestService requestService;

    @Mock
    private OrganisationAccountStatusUpdateService accountStatusUpdateService;

    @Test
    void execute() {
        String requestId = "id";
        Long accountId = 1L;
        Request request = Request.builder().id(requestId).accountId(accountId).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        //invoke
        accountOpeningRejectAccountService.execute(requestId);

        //verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(accountStatusUpdateService, times(1)).handleOrganisationAccountRejected(accountId);
    }
}