package uk.gov.esos.api.authorization.rules.services.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;

@Service
@RequiredArgsConstructor
public class AppAccountAuthorizationService implements AppResourceAuthorizationService {

    private final AccountAuthorizationServiceDelegator accountAuthorizationService;

    @Override
    public boolean isAuthorized(AppUser user, AuthorizationCriteria criteria) {
        final boolean isAuthorized;
        if (criteria.getPermission() == null) {
            isAuthorized = accountAuthorizationService.isAuthorized(user, criteria.getAccountId());
        } else {
            isAuthorized = accountAuthorizationService.isAuthorized(user, criteria.getAccountId(), criteria.getPermission());
        }

        return isAuthorized;
    }

    @Override
    public ResourceType getResourceType() {
        return ResourceType.ACCOUNT;
    }
}
