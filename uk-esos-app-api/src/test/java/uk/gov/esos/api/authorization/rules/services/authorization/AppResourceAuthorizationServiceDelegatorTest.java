package uk.gov.esos.api.authorization.rules.services.authorization;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension.class)
class AppResourceAuthorizationServiceDelegatorTest {

    private AppResourceAuthorizationServiceDelegator appResourceAuthorizationServiceDelegator;
    private AppAccountAuthorizationService appAccountAuthorizationService;
    private AppCompAuthAuthorizationService appCompAuthAuthorizationService;
    private AppVerificationBodyAuthorizationService pmrvVerificationBodyAuthorizationService;

    private final AppUser user = AppUser.builder().userId("user").build();
    private final AuthorizationCriteria criteria = AuthorizationCriteria.builder().build();

    @BeforeAll
    void beforeAll() {
        appAccountAuthorizationService = Mockito.mock(AppAccountAuthorizationService.class);
        appCompAuthAuthorizationService = Mockito.mock(AppCompAuthAuthorizationService.class);
        pmrvVerificationBodyAuthorizationService = Mockito.mock(AppVerificationBodyAuthorizationService.class);
        appResourceAuthorizationServiceDelegator =
            new AppResourceAuthorizationServiceDelegator(List.of(appAccountAuthorizationService,
                    appCompAuthAuthorizationService, pmrvVerificationBodyAuthorizationService));

        when(appAccountAuthorizationService.getResourceType()).thenReturn(ResourceType.ACCOUNT);
        when(appCompAuthAuthorizationService.getResourceType()).thenReturn(ResourceType.CA);
        when(pmrvVerificationBodyAuthorizationService.getResourceType()).thenReturn(ResourceType.VERIFICATION_BODY);
    }

    @Test
    void isAuthorized_resource_account() {
        when(appAccountAuthorizationService.isAuthorized(user, criteria)).thenReturn(true);

        assertTrue(appResourceAuthorizationServiceDelegator.isAuthorized(ResourceType.ACCOUNT, user, criteria));

        verify(appAccountAuthorizationService, times(1)).isAuthorized(user, criteria);
    }

    @Test
    void isAuthorized_resource_competent_authority() {
        when(appCompAuthAuthorizationService.isAuthorized(user, criteria)).thenReturn(true);

        assertTrue(appResourceAuthorizationServiceDelegator.isAuthorized(ResourceType.CA, user, criteria));

        verify(appCompAuthAuthorizationService, times(1)).isAuthorized(user, criteria);
    }

    @Test
    void isAuthorized_resource_verification_body() {
        when(pmrvVerificationBodyAuthorizationService.isAuthorized(user, criteria)).thenReturn(true);

        assertTrue(appResourceAuthorizationServiceDelegator.isAuthorized(ResourceType.VERIFICATION_BODY, user, criteria));

        verify(pmrvVerificationBodyAuthorizationService, times(1)).isAuthorized(user, criteria);
    }

    @Test
    void isAuthorized_resource_null() {
        assertFalse(appResourceAuthorizationServiceDelegator.isAuthorized(null, user, criteria));
    }
}