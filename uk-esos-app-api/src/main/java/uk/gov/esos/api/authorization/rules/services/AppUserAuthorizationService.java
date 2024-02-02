package uk.gov.esos.api.authorization.rules.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@Service
@RequiredArgsConstructor
public class AppUserAuthorizationService {

    private final AuthorizationRulesService authorizationRulesService;

    public void authorize(AppUser pmrvUser, String serviceName) {
        authorizationRulesService.evaluateRules(pmrvUser, serviceName);
    }

    public void authorize(AppUser pmrvUser, String serviceName, String resourceId) {
        authorizationRulesService.evaluateRules(pmrvUser, serviceName, resourceId);
    }

    public void authorize(AppUser pmrvUser, String serviceName, String resourceId, String resourceSubType) {
        authorizationRulesService.evaluateRules(pmrvUser, serviceName, resourceId, resourceSubType);
    }
}
