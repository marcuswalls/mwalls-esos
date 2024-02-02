package uk.gov.esos.api.mireport.organisation.accountsregulatorsitecontacts;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsMiReportResult;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountAssignedRegulatorSiteContactReportGeneratorHandlerTest {

    @InjectMocks
    OrganisationAccountAssignedRegulatorSiteContactReportGeneratorHandler generator;

    @Mock
    OrganisationAccountAssignedRegulatorSiteContactsRepository repository;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private EntityManager entityManager;

    @Test
    void getReportType() {
        assertEquals(MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS, generator.getReportType());
    }

    @Test
    void generateMiReport() {
        EmptyMiReportParams reportParams = EmptyMiReportParams.builder().build();
        String userId = UUID.randomUUID().toString();

        when(repository.findAccountAssignedRegulatorSiteContacts(entityManager)).thenReturn(
                List.of(createAccountAssignedRegulatorSiteContact("orgId1", AccountType.ORGANISATION, "accountName1",
                        OrganisationAccountStatus.LIVE, userId),
                        createAccountAssignedRegulatorSiteContact("orgId2", AccountType.ORGANISATION, "accountName2",
                            OrganisationAccountStatus.LIVE, null)
                        ));

        String firstName = "fname";
        String lastName = "lname";
        when(userAuthService.getUsers(List.of(userId))).thenReturn(List.of(createUserInfo(userId, firstName, lastName,
                "email")));

        AccountAssignedRegulatorSiteContactsMiReportResult miReportResult =
                (AccountAssignedRegulatorSiteContactsMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertNotNull(miReportResult);
        assertEquals(MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS, miReportResult.getReportType());
        assertEquals(2, miReportResult.getResults().size());
        AccountAssignedRegulatorSiteContact accountAssignedRegulatorSiteContact1 = miReportResult.getResults().get(0);
        AccountAssignedRegulatorSiteContact accountAssignedRegulatorSiteContact2 = miReportResult.getResults().get(1);
        assertEquals(userId, accountAssignedRegulatorSiteContact1.getUserId());
        assertEquals("fname lname", accountAssignedRegulatorSiteContact1.getAssignedRegulatorName());
        assertNull(accountAssignedRegulatorSiteContact2.getUserId());
        assertNull(accountAssignedRegulatorSiteContact2.getAssignedRegulatorName());

    }

    private UserInfo createUserInfo(String id, String firstName, String lastName, String email) {
        return UserInfo.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .enabled(true)
                .build();
    }

    private AccountAssignedRegulatorSiteContact createAccountAssignedRegulatorSiteContact(String organisationId, AccountType accountType,
                                                                                          String accountName, OrganisationAccountStatus accountStatus,
                                                                                          String userId) {
        return AccountAssignedRegulatorSiteContact.builder()
                .accountId(organisationId)
                .accountType(accountType.name())
                .accountName(accountName)
                .accountStatus(accountStatus.name())
                .userId(userId)
                .build();
    }
}
