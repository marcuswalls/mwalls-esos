package uk.gov.esos.api.authorization.rules.services.handlers;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.AccountNoteAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;


@Service("accountNoteAccessHandler")
@RequiredArgsConstructor
public class AccountNoteAccessRuleHandler implements AuthorizationResourceRuleHandler {
    
    private final AppAuthorizationService appAuthorizationService;
    private final AccountNoteAuthorityInfoProvider accountNoteAuthorityInfoProvider;
    
    @Override
    public void evaluateRules(final Set<AuthorizationRuleScopePermission> authorizationRules, 
                              final AppUser user,
                              final String resourceId) {

        final Long accountId = accountNoteAuthorityInfoProvider.getAccountIdById(Long.parseLong(resourceId));

        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                    .accountId(accountId)
                    .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }

}
