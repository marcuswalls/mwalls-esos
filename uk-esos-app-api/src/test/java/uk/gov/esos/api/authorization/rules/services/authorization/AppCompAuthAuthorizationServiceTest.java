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

import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@ExtendWith(MockitoExtension.class)
class AppCompAuthAuthorizationServiceTest {

    @InjectMocks
    private AppCompAuthAuthorizationService appCompAuthAuthorizationService;

    @Mock
    private CompAuthAuthorizationServiceDelegator compAuthAuthorizationServiceDelegator;

    private final AppUser user = AppUser.builder().roleType(RoleType.REGULATOR).build();

    @Test
    void isAuthorized_no_permission() {
        CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
        AuthorizationCriteria criteria = AuthorizationCriteria.builder().competentAuthority(compAuth).build();

        when(compAuthAuthorizationServiceDelegator.isAuthorized(user, compAuth)).thenReturn(true);

        assertTrue(appCompAuthAuthorizationService.isAuthorized(user, criteria));
        verify(compAuthAuthorizationServiceDelegator, times(1)).isAuthorized(user, compAuth);
    }

    @Test
    void isAuthorized_with_permission() {
        CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
        Permission permission = Permission.PERM_TASK_ASSIGNMENT;
        AuthorizationCriteria criteria = AuthorizationCriteria
            .builder()
            .competentAuthority(compAuth)
            .permission(permission)
            .build();

        when(compAuthAuthorizationServiceDelegator.isAuthorized(user, compAuth, permission))
            .thenReturn(true);

        assertTrue(appCompAuthAuthorizationService.isAuthorized(user, criteria));
        verify(compAuthAuthorizationServiceDelegator, times(1))
            .isAuthorized(user, compAuth, permission);
    }

    @Test
    void getResourceType() {
        assertEquals(ResourceType.CA, appCompAuthAuthorizationService.getResourceType());
    }

}