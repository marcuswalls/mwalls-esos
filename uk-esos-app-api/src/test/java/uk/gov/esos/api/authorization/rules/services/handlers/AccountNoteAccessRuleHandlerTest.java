package uk.gov.esos.api.authorization.rules.services.handlers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.AccountNoteAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@ExtendWith(MockitoExtension.class)
class AccountNoteAccessRuleHandlerTest {

    @InjectMocks
    private AccountNoteAccessRuleHandler accountNoteAccessRuleHandler;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    @Mock
    private AccountNoteAuthorityInfoProvider accountNoteAuthorityInfoProvider;

    @Test
    void evaluateRules() {

        final long noteId = 2;
        final long accountId = 1;
        final AppUser pmrvUser = AppUser.builder().
            roleType(RoleType.REGULATOR)
            .build();
        final AuthorizationRuleScopePermission authorizationRule = AuthorizationRuleScopePermission.builder().build();
        final Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule);
        final AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .accountId(accountId)
            .build();

        when(accountNoteAuthorityInfoProvider.getAccountIdById(noteId)).thenReturn(accountId);

        accountNoteAccessRuleHandler.evaluateRules(rules, pmrvUser, String.valueOf(noteId));

        verify(accountNoteAuthorityInfoProvider, times(1)).getAccountIdById(noteId);
        verify(appAuthorizationService, times(1)).authorize(pmrvUser, authorizationCriteria);
    }

    @Test
    void evaluateRules_resource_forbidden() {

        final long noteId = 2;
        final long accountId = 1;
        final AppUser pmrvUser = AppUser.builder().
            roleType(RoleType.OPERATOR)
            .build();
        final AuthorizationRuleScopePermission authorizationRule = AuthorizationRuleScopePermission.builder().build();
        final Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule);
        final AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .accountId(accountId)
            .build();

        when(accountNoteAuthorityInfoProvider.getAccountIdById(noteId)).thenReturn(accountId);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN)).when(appAuthorizationService)
            .authorize(pmrvUser, authorizationCriteria);

        final BusinessException be = assertThrows(BusinessException.class, () ->
            accountNoteAccessRuleHandler.evaluateRules(rules, pmrvUser, String.valueOf(noteId)));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN);

        verify(accountNoteAuthorityInfoProvider, times(1)).getAccountIdById(noteId);
        verify(appAuthorizationService, times(1)).authorize(pmrvUser, authorizationCriteria);
    }
}
