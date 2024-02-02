package uk.gov.esos.api.authorization.rules.services.authorization;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;

public interface AppResourceAuthorizationService {
    boolean isAuthorized(AppUser user, AuthorizationCriteria criteria);
    ResourceType getResourceType();
}
