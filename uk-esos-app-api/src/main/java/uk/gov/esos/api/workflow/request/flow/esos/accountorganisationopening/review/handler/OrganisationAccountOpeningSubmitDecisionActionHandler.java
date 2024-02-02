package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload;

import java.util.List;
import java.util.Map;

import static uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants.APPLICATION_APPROVED;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningSubmitDecisionActionHandler implements
    RequestTaskActionHandler<OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload> {
    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser, OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Request request = requestTask.getRequest();

        OrganisationAccountOpeningApplicationRequestTaskPayload requestTaskPayload = (OrganisationAccountOpeningApplicationRequestTaskPayload) requestTask.getPayload();
        AccountOpeningDecisionPayload decision = payload.getDecision();
        boolean isApplicationApproved = decision.getDecision() == Decision.APPROVED;

        updateRequestPayload(request, requestTaskPayload, decision);

        workflowService.completeTask(
            requestTask.getProcessTaskId(),
            Map.of(APPLICATION_APPROVED, isApplicationApproved));
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION);
    }

    private void updateRequestPayload(Request request, OrganisationAccountOpeningApplicationRequestTaskPayload requestTaskPayload,
                                      AccountOpeningDecisionPayload decisionPayload) {
        OrganisationAccountOpeningRequestPayload requestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        requestPayload.setAccount(requestTaskPayload.getAccount());
        requestPayload.setDecision(decisionPayload);
    }
}
