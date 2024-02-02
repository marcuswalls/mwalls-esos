package uk.gov.esos.api.authorization.rules.services.authorization;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

@ExtendWith(MockitoExtension.class)
class AppAccountAuthorizationServiceTest {

    @InjectMocks
    private AppAccountAuthorizationService appAccountAuthorizationService;

    @Mock
    private AccountAuthorizationServiceDelegator accountAuthorizationServiceDelegator;

    private final AppUser user = AppUser.builder().roleType(RoleType.OPERATOR).build();

    @Test
    void isAuthorized_no_permission() {
        Long accountId = 1L;
        AuthorizationCriteria criteria = AuthorizationCriteria
            .builder()
            .accountId(accountId)
            .build();

        when(accountAuthorizationServiceDelegator.isAuthorized(user, accountId))
            .thenReturn(true);

        assertTrue(appAccountAuthorizationService.isAuthorized(user, criteria));
        verify(accountAuthorizationServiceDelegator, times(1))
            .isAuthorized(user, accountId);
    }

    @Test
    void isAuthorized_with_permission() {
        Long accountId = 1L;
        Permission permission = Permission.PERM_TASK_ASSIGNMENT;
        AuthorizationCriteria criteria = AuthorizationCriteria
            .builder()
            .accountId(accountId)
            .permission(permission)
            .build();

        when(accountAuthorizationServiceDelegator.isAuthorized(user, accountId, permission))
            .thenReturn(true);

        assertTrue(appAccountAuthorizationService.isAuthorized(user, criteria));
        verify(accountAuthorizationServiceDelegator, times(1))
            .isAuthorized(user, accountId, permission);
    }

    @Test
    void getResourceType() {
        assertEquals(ResourceType.ACCOUNT, appAccountAuthorizationService.getResourceType());
    }
}