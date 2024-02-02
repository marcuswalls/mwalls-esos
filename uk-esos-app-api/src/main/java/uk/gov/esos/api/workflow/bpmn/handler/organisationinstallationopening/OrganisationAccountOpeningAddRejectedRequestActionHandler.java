package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningDecisionSubmittedAddRequestActionService;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningAddRejectedRequestActionHandler implements JavaDelegate {

    private final OrganisationAccountOpeningDecisionSubmittedAddRequestActionService addRequestActionService;

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        addRequestActionService.addRequestAction(requestId);
    }
}
