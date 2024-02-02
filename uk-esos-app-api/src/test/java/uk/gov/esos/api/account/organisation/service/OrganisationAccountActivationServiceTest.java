package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.service.AccountContactUpdateService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountActivationServiceTest {

    @InjectMocks
    private OrganisationAccountActivationService accountActivationService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

    @Mock
    private OperatorAuthorityService operatorauthorityService;

    @Mock
    private OrganisationAccountStatusUpdateService organisationAccountStatusUpdateService;

    @Mock
    private AccountContactUpdateService accountContactUpdateService;

    @Test
    void activateAccount() {
        Long accountId = 1L;
        String user = "user";

        OrganisationAccount account = OrganisationAccount.builder().id(accountId).build();

        when(organisationAccountQueryService.getAccountById(accountId)).thenReturn(account);

        //invoke
        accountActivationService.activateAccount(accountId, user);


        //verify
        assertNotNull(account.getAcceptedDate());
        verify(organisationAccountQueryService, times(1)).getAccountById(accountId);
        verify(operatorauthorityService, times(1)).createOperatorAdminAuthority(accountId, user);
        verify(organisationAccountStatusUpdateService, times(1)).handleOrganisationAccountAccepted(accountId);
        verify(accountContactUpdateService, times(1)).assignUserAsPrimaryContact(user, account);
    }
}