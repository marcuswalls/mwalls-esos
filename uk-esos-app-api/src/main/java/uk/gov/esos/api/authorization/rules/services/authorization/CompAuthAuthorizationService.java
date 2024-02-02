package uk.gov.esos.api.authorization.rules.services.authorization;

import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;

public interface CompAuthAuthorizationService {
    boolean isAuthorized(AppUser user, CompetentAuthorityEnum competentAuthority);
    boolean isAuthorized(AppUser user, CompetentAuthorityEnum competentAuthority, Permission permission);
    RoleType getRoleType();
}
