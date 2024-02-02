package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningSendApprovalEmailService;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningSendApprovalEmailHandler implements JavaDelegate {

    private final OrganisationAccountOpeningSendApprovalEmailService sendApprovalEmailService;

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        sendApprovalEmailService.sendEmail(requestId);
    }
}
