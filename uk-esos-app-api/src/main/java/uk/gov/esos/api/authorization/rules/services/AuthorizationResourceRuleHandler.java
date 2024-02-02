package uk.gov.esos.api.authorization.rules.services;

import java.util.Set;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

public interface AuthorizationResourceRuleHandler {

    /**
     * Evaluates the {@code authorizationRules}.
     * @param authorizationRules the list of {@link AuthorizationRuleScopePermission}
     * @param user the authenticated user
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     */
    void evaluateRules(Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId);
}
