package uk.gov.esos.api.workflow.request.flow.payment.handler;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentOutcome;
import uk.gov.esos.api.workflow.request.flow.payment.service.PaymentCompleteService;

@Component
@RequiredArgsConstructor
public class PaymentMarkAsPaidHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final PaymentCompleteService paymentCompleteService;
    private final WorkflowService workflowService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser pmrvUser,
                        RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        paymentCompleteService.markAsPaid(requestTask, pmrvUser);

        workflowService.completeTask(requestTask.getProcessTaskId(),
            Map.of(BpmnProcessConstants.PAYMENT_OUTCOME, PaymentOutcome.MARK_AS_PAID));
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.PAYMENT_MARK_AS_PAID);
    }
}
