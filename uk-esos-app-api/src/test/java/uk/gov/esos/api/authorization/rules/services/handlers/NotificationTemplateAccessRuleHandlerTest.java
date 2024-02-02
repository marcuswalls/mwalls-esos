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
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.NotificationTemplateAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@ExtendWith(MockitoExtension.class)
class NotificationTemplateAccessRuleHandlerTest {

    @InjectMocks
    private NotificationTemplateAccessRuleHandler handler;

    @Mock
    private NotificationTemplateAuthorityInfoProvider templateAuthorityInfoProvider;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    @Test
    void evaluateRules() {
        Long notificationTemplateId = 1L;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        AppUser pmrvUser = AppUser.builder().
            roleType(RoleType.REGULATOR)
            .build();
        AuthorizationRuleScopePermission authorizationRule1 = AuthorizationRuleScopePermission.builder().build();
        Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule1);
        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .competentAuthority(competentAuthority)
            .build();

        when(templateAuthorityInfoProvider.getNotificationTemplateCaById(notificationTemplateId)).thenReturn(competentAuthority);

        handler.evaluateRules(rules, pmrvUser, String.valueOf(notificationTemplateId));

        verify(templateAuthorityInfoProvider, times(1)).getNotificationTemplateCaById(notificationTemplateId);
        verify(appAuthorizationService, times(1)).authorize(pmrvUser, authorizationCriteria);
    }

    @Test
    void evaluateRules_resource_forbidden() {
        Long notificationTemplateId = 1L;
        CompetentAuthorityEnum resourceCompetentAuthority = CompetentAuthorityEnum.ENGLAND;
        AppUser pmrvUser = AppUser.builder().
            roleType(RoleType.OPERATOR)
            .build();
        AuthorizationRuleScopePermission authorizationRule1 = AuthorizationRuleScopePermission.builder().build();
        Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule1);
        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .competentAuthority(resourceCompetentAuthority)
            .build();

        when(templateAuthorityInfoProvider.getNotificationTemplateCaById(notificationTemplateId)).thenReturn(resourceCompetentAuthority);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN)).when(appAuthorizationService).authorize(pmrvUser, authorizationCriteria);

        BusinessException be = assertThrows(BusinessException.class, () ->
            handler.evaluateRules(rules, pmrvUser, String.valueOf(notificationTemplateId)));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN);
        verify(templateAuthorityInfoProvider, times(1)).getNotificationTemplateCaById(notificationTemplateId);
        verify(appAuthorizationService, times(1)).authorize(pmrvUser, authorizationCriteria);
    }
}