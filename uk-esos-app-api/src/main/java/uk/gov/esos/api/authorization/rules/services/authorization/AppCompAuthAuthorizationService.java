package uk.gov.esos.api.authorization.rules.services.authorization;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;

@Service
@RequiredArgsConstructor
public class AppCompAuthAuthorizationService implements AppResourceAuthorizationService {

    private final CompAuthAuthorizationServiceDelegator compAuthAuthorizationService;

    @Override
    public boolean isAuthorized(AppUser user, AuthorizationCriteria criteria) {
        boolean isAuthorized;
        if (ObjectUtils.isEmpty(criteria.getPermission())) {
            isAuthorized = compAuthAuthorizationService.isAuthorized(user, criteria.getCompetentAuthority());
        } else {
            isAuthorized = compAuthAuthorizationService.isAuthorized(user, criteria.getCompetentAuthority(), criteria.getPermission());
        }

        return isAuthorized;
    }

    @Override
    public ResourceType getResourceType() {
        return ResourceType.CA;
    }
}
