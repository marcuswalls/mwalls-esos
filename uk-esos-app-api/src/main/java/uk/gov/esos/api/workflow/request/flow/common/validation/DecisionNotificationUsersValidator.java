package uk.gov.esos.api.workflow.request.flow.common.validation;

import java.util.Set;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.common.domain.DecisionNotification;

@Service
@RequiredArgsConstructor
public class DecisionNotificationUsersValidator {

    private final WorkflowUsersValidator workflowUsersValidator;

    public boolean areUsersValid(final RequestTask requestTask, final DecisionNotification decisionNotification,
            final AppUser pmrvUser) {

        final Long accountId = requestTask.getRequest().getAccountId();
        final Set<String> operators = decisionNotification.getOperators();
        final boolean operatorsValid = workflowUsersValidator.areOperatorsValid(accountId, operators, pmrvUser);
        if (!operatorsValid) {
            return false;
        }

        final Set<Long> externalContacts = decisionNotification.getExternalContacts();
        final boolean externalContactValid = workflowUsersValidator.areExternalContactsValid(externalContacts,
                pmrvUser);
        if (!externalContactValid) {
            return false;
        }

        final String signatory = decisionNotification.getSignatory();
        return workflowUsersValidator.isSignatoryValid(requestTask, signatory);
    }
}
