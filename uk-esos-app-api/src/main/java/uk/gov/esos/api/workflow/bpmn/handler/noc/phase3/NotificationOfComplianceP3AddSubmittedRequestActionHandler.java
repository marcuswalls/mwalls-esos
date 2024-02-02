package uk.gov.esos.api.workflow.bpmn.handler.noc.phase3;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service.NotificationOfComplianceP3AddSubmittedRequestActionService;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3AddSubmittedRequestActionHandler implements JavaDelegate {

    private final NotificationOfComplianceP3AddSubmittedRequestActionService addSubmittedRequestActionService;

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        addSubmittedRequestActionService.addRequestAction(requestId);
    }
}
