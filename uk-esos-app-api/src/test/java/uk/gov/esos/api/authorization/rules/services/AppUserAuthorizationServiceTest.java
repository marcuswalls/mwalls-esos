package uk.gov.esos.api.authorization.rules.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AppUserAuthorizationServiceTest {

    @InjectMocks
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private AuthorizationRulesService authorizationRulesService;

    @Test
    void authorize_no_resource() {
        String serviceName = "serviceName";
        AppUser pmrvUser = AppUser.builder().build();
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(1L).build()
        );
        pmrvUser.setAuthorities(authorities);

        assertDoesNotThrow(() -> appUserAuthorizationService.authorize(pmrvUser, serviceName));

        verify(authorizationRulesService, times(1)).evaluateRules(pmrvUser, serviceName);
    }

    @Test
    void authorize_no_resource_sub_type() {
        String serviceName = "serviceName";
        String resourceId = "resourceId";
        AppUser pmrvUser = AppUser.builder().build();
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(1L).build()
        );
        pmrvUser.setAuthorities(authorities);

        appUserAuthorizationService.authorize(pmrvUser, serviceName, resourceId);

        verify(authorizationRulesService, times(1)).evaluateRules(pmrvUser, serviceName, resourceId);
    }

    @Test
    void authorize_with_resource_and_resource_sub_type() {
        String serviceName = "serviceName";
        String resourceId = "resourceId";
        String resourceSubType = "resourceSubType";

        AppUser pmrvUser = AppUser.builder().build();
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(1L).build()
        );
        pmrvUser.setAuthorities(authorities);

        appUserAuthorizationService.authorize(pmrvUser, serviceName, resourceId, resourceSubType);

        verify(authorizationRulesService, times(1))
            .evaluateRules(pmrvUser, serviceName, resourceId, resourceSubType);
    }
    
    @Test
    void authorize_installation_create_request_action() {
        String serviceName = "serviceName";
        String resourceId = null;
        String resourceSubType = RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name();

        AppUser pmrvUser = AppUser.builder().userId("user").build();

        appUserAuthorizationService.authorize(pmrvUser, serviceName, resourceId, resourceSubType);

        verify(authorizationRulesService, times(1))
            .evaluateRules(pmrvUser, serviceName, resourceId, resourceSubType);
    }

}