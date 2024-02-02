package uk.gov.esos.api.authorization.rules.services.handlers;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.NotificationTemplateAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@Service("notificationTemplateAccessHandler")
@RequiredArgsConstructor
public class NotificationTemplateAccessRuleHandler implements AuthorizationResourceRuleHandler {

    private final NotificationTemplateAuthorityInfoProvider templateAuthorityInfoProvider;
    private final AppAuthorizationService appAuthorizationService;

    @Override
    public void evaluateRules(Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user,
                              String resourceId) {

        CompetentAuthorityEnum competentAuthority = templateAuthorityInfoProvider.getNotificationTemplateCaById(Long.parseLong(resourceId));

        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .competentAuthority(competentAuthority)
                .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }
}
