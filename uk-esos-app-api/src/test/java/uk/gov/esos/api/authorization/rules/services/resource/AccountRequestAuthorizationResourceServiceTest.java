package uk.gov.esos.api.authorization.rules.services.resource;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.repository.AuthorizationRuleRepository;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppResourceAuthorizationServiceDelegator;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountRequestAuthorizationResourceServiceTest {

    @InjectMocks
    private AccountRequestAuthorizationResourceService service;
    
    @Mock
    private AuthorizationRuleRepository authorizationRuleRepository;
    
    @Mock
    private AppResourceAuthorizationServiceDelegator resourceAuthorizationServiceDelegator;
    
    @Test
    void findRequestCreateActionsByAccountId() {
        AppUser user = AppUser.builder().roleType(RoleType.OPERATOR).build();
        Long accountId = 1L;
        
        List<AuthorizationRuleScopePermission> rules = List.of(
                AuthorizationRuleScopePermission.builder().resourceSubType(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name()).handler("handler").permission(null).build());
        
        when(authorizationRuleRepository.findRulePermissionsByResourceTypeScopeAndRoleType(ResourceType.ACCOUNT, Scope.REQUEST_CREATE, RoleType.OPERATOR)).thenReturn(rules);
        
        when(resourceAuthorizationServiceDelegator.isAuthorized(ResourceType.ACCOUNT, user, AuthorizationCriteria.builder().accountId(accountId).permission(null).build())).thenReturn(true);
        
        Set<String> results = service.findRequestCreateActionsByAccountId(user, accountId);
        
        assertThat(results)
            .hasSize(1)
            .containsOnly(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name());
    }
}
