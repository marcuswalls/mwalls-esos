package uk.gov.esos.api.authorization.rules.services.authorization;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

public interface AccountAuthorizationService {
    boolean isAuthorized(AppUser user, Long accountId);
    boolean isAuthorized(AppUser user, Long accountId, Permission permission);
    RoleType getRoleType();
}
