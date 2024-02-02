package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountActivationService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningActivateAccountService {
    private final OrganisationAccountActivationService organisationAccountActivationService;
    private final RequestService requestService;

    public void execute(String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final OrganisationAccountOpeningRequestPayload orgAccOpeningRequestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        organisationAccountActivationService.activateAccount(request.getAccountId(), orgAccOpeningRequestPayload.getOperatorAssignee());
    }

}
