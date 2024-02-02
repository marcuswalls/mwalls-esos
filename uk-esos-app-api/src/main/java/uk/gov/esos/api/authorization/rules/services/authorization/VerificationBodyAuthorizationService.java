package uk.gov.esos.api.authorization.rules.services.authorization;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

public interface VerificationBodyAuthorizationService {
    boolean isAuthorized(AppUser user, Long verificationBodyId);
    boolean isAuthorized(AppUser user, Long verificationBodyId, Permission permission);
    RoleType getRoleType();
}
