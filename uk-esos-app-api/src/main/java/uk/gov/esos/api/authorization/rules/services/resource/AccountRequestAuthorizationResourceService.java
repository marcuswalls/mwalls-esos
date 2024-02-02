package uk.gov.esos.api.authorization.rules.services.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.repository.AuthorizationRuleRepository;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppResourceAuthorizationServiceDelegator;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class AccountRequestAuthorizationResourceService {

    private final AuthorizationRuleRepository authorizationRuleRepository;
    private final AppResourceAuthorizationServiceDelegator resourceAuthorizationServiceDelegator;
    
    public Set<String> findRequestCreateActionsByAccountId(AppUser user, Long accountId){
        List<AuthorizationRuleScopePermission> rules = 
                authorizationRuleRepository
                        .findRulePermissionsByResourceTypeScopeAndRoleType(ResourceType.ACCOUNT, Scope.REQUEST_CREATE, user.getRoleType());
        
        Set<String> allowedActions = new HashSet<>();
        rules.forEach(rule -> {
            if (resourceAuthorizationServiceDelegator.isAuthorized(ResourceType.ACCOUNT, user,
                    AuthorizationCriteria.builder().accountId(accountId).permission(rule.getPermission()).build())) {
                allowedActions.add(rule.getResourceSubType());
            }
        });
        
        return allowedActions;
    }
}
