package uk.gov.esos.api.authorization.rules.services.handlers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@ExtendWith(MockitoExtension.class)
class VerificationBodyAccessRuleHandlerTest {

    @InjectMocks
    private VerificationBodyAccessRuleHandler handler;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    @Test
    void evaluateRules() {
        final Long verificationBodyId = 1L;
        final Permission vbUserEditPermission = Permission.PERM_CA_USERS_EDIT;
        final AppUser authUser = AppUser.builder().userId("user1").roleType(RoleType.VERIFIER)
                .authorities(List.of(
                        AppAuthority.builder().code("verifier_admin").verificationBodyId(verificationBodyId)
                                .permissions(List.of(Permission.PERM_CA_USERS_EDIT)).build()))
                .build();

        AuthorizationRuleScopePermission authorizationRule = 
                AuthorizationRuleScopePermission.builder()
            .permission(vbUserEditPermission)
            .build();

        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .verificationBodyId(verificationBodyId)
                .permission(vbUserEditPermission)
                .build();

        // Invoke
        handler.evaluateRules(Set.of(authorizationRule), authUser);

        // Verify
        verify(appAuthorizationService, times(1)).authorize(authUser, authorizationCriteria);
    }

    @Test
    void evaluateRules_does_not_exist() {
        final Permission vbUserEditPermission = Permission.PERM_CA_USERS_EDIT;
        final AppUser authUser = AppUser.builder().userId("user1").roleType(RoleType.VERIFIER)
                .authorities(Collections.emptyList()).build();

        AuthorizationRuleScopePermission authorizationRule = 
                AuthorizationRuleScopePermission.builder()
            .permission(vbUserEditPermission)
            .build();

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class, () ->
            handler.evaluateRules(Set.of(authorizationRule), authUser));

        // Assert
        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN);

        // Verify
        verify(appAuthorizationService, never()).authorize(Mockito.any(AppUser.class), Mockito.any(AuthorizationCriteria.class));
    }

}