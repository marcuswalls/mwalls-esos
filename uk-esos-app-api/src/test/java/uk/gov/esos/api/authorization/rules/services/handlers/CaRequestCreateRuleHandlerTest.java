package uk.gov.esos.api.authorization.rules.services.handlers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;

@ExtendWith(MockitoExtension.class)
class CaRequestCreateRuleHandlerTest {

	@InjectMocks
    private CaRequestCreateRuleHandler cut;
	
	@Mock
    private AppAuthorizationService appAuthorizationService;
    
    private final AppUser USER = AppUser.builder().roleType(RoleType.REGULATOR)
    		.authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
    		.build();
    
    @Test
    void evaluateRules_empty_rules() {
        String resourceId = "1";
        
        BusinessException be = assertThrows(BusinessException.class, () -> cut.evaluateRules(Set.of(), USER,
                resourceId));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN);
        verifyNoInteractions(appAuthorizationService);
    }
    
    @Test
    void evaluateRules() {
        AuthorizationRuleScopePermission authorizationRulePermissionScope1 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK)
            .resourceSubType(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name())
            .build();
        AuthorizationRuleScopePermission authorizationRulePermissionScope2 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_CA_USERS_EDIT)
            .resourceSubType(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name())
            .build();
        
        cut.evaluateRules(Set.of(authorizationRulePermissionScope1, authorizationRulePermissionScope2), USER, null);

        verify(appAuthorizationService, times(1)).authorize(USER, AuthorizationCriteria.builder()
        		.permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK)
        		.competentAuthority(CompetentAuthorityEnum.ENGLAND)
        		.build());
        verify(appAuthorizationService, times(1)).authorize(USER, AuthorizationCriteria.builder()
        		.permission(Permission.PERM_CA_USERS_EDIT)
        		.competentAuthority(CompetentAuthorityEnum.ENGLAND)
        		.build());
        verifyNoMoreInteractions(appAuthorizationService);
    }
}
