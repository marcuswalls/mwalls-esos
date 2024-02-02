package uk.gov.esos.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.service.AccountContactUpdateService;
import uk.gov.esos.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.esos.api.authorization.operator.domain.NewUserActivated;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityUpdateService;
import uk.gov.esos.api.user.operator.service.OperatorUserNotificationGateway;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountOperatorUserAuthorityUpdateOrchestrator {

    private final OperatorAuthorityUpdateService operatorAuthorityUpdateService;
    private final OperatorUserNotificationGateway operatorUserNotificationGateway;
    private final AccountContactUpdateService accountContactUpdateService;

    @Transactional
    public void updateAccountOperatorAuthorities(List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities,
                                                 Map<AccountContactType, String> updatedContactTypes, Long accountId) {

        List<NewUserActivated> activatedOperators = operatorAuthorityUpdateService
                .updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);

        accountContactUpdateService.updateAccountContacts(updatedContactTypes, accountId);

        if(!activatedOperators.isEmpty()){
            operatorUserNotificationGateway.notifyUsersUpdateStatus(activatedOperators);
        }
    }
}
