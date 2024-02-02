package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningActivateAccountService;


@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningActivateAccountHandler implements JavaDelegate {
    private final OrganisationAccountOpeningActivateAccountService organisationAccountOpeningActivateAccountService;

    @Override
    public void execute(DelegateExecution execution) {
        organisationAccountOpeningActivateAccountService.execute((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
