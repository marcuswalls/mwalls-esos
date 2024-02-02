package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountStatusUpdateService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningRejectAccountService {

    private final RequestService requestService;
    private final OrganisationAccountStatusUpdateService accountStatusUpdateService;

    public void execute(String requestId) {
        Request request = requestService.findRequestById(requestId);
        accountStatusUpdateService.handleOrganisationAccountRejected(request.getAccountId());
    }
}
