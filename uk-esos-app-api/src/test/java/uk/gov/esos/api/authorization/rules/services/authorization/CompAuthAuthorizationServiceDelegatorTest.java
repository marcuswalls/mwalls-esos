package uk.gov.esos.api.authorization.rules.services.authorization;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension.class)
class CompAuthAuthorizationServiceDelegatorTest {
    private CompAuthAuthorizationServiceDelegator compAuthAuthorizationServiceDelegator;
    private RegulatorCompAuthAuthorizationService regulatorCompAuthAuthorizationService;

    @BeforeAll
    void setup() {
        compAuthAuthorizationServiceDelegator = Mockito.mock(CompAuthAuthorizationServiceDelegator.class);
        regulatorCompAuthAuthorizationService = Mockito.mock(RegulatorCompAuthAuthorizationService.class);
        compAuthAuthorizationServiceDelegator = new CompAuthAuthorizationServiceDelegator(List.of(regulatorCompAuthAuthorizationService));
        when(regulatorCompAuthAuthorizationService.getRoleType()).thenReturn(RoleType.REGULATOR);
    }

    private final AppUser OPERATOR = AppUser.builder().roleType(RoleType.OPERATOR).build();
    private final AppUser REGULATOR = AppUser.builder().roleType(RoleType.REGULATOR).build();

    @Test
    void isAuthorized_operator_no_permissions() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        assertFalse(compAuthAuthorizationServiceDelegator.isAuthorized(OPERATOR, competentAuthority));
    }

    @Test
    void isAuthorized_operator_with_permissions() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        Permission permission = Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;

        assertFalse(compAuthAuthorizationServiceDelegator.isAuthorized(OPERATOR, competentAuthority, permission));
    }

    @Test
    void isAuthorized_regulator_no_permissions() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        when(regulatorCompAuthAuthorizationService.isAuthorized(REGULATOR, competentAuthority)).thenReturn(true);

        assertTrue(compAuthAuthorizationServiceDelegator.isAuthorized(REGULATOR, competentAuthority));

        verify(regulatorCompAuthAuthorizationService, times(1)).isAuthorized(REGULATOR, competentAuthority);
    }

    @Test
    void isAuthorized_regulator_with_permissions() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        Permission permission = Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;
        when(regulatorCompAuthAuthorizationService.isAuthorized(REGULATOR, competentAuthority, permission)).thenReturn(true);

        assertTrue(compAuthAuthorizationServiceDelegator.isAuthorized(REGULATOR, competentAuthority, permission));

        verify(regulatorCompAuthAuthorizationService, times(1)).isAuthorized(REGULATOR, competentAuthority, permission);
    }
}