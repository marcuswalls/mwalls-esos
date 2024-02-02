package uk.gov.esos.api.authorization.rules.services.handlers;

import java.util.Set;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@Service("caRequestCreateHandler")
@RequiredArgsConstructor
public class CaRequestCreateRuleHandler implements AuthorizationResourceRuleHandler {
    
    private final AppAuthorizationService appAuthorizationService;
    
    @Override
    public void evaluateRules(Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user,
            String resourceId) {
        if (authorizationRules.isEmpty()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

		authorizationRules.forEach(rule -> appAuthorizationService.authorize(user, AuthorizationCriteria.builder()
				.competentAuthority(user.getCompetentAuthority())
				.permission(rule.getPermission())
				.build()));
    }
}
