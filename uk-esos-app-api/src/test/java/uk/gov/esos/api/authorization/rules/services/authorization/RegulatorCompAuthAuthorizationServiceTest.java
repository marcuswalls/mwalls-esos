package uk.gov.esos.api.authorization.rules.services.authorization;

import org.junit.jupiter.api.Test;

import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegulatorCompAuthAuthorizationServiceTest {
    private final RegulatorCompAuthAuthorizationService regulatorCompAuthAuthorizationService = new RegulatorCompAuthAuthorizationService();

    private final AppAuthority pmrvAuthority = AppAuthority.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .permissions(List.of(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                    Permission.PERM_ORGANISATION_ACCOUNT_OPENING_ARCHIVE_EXECUTE_TASK))
            .build();
    private final AppUser user = AppUser.builder().authorities(List.of(pmrvAuthority)).roleType(RoleType.REGULATOR).build();

    @Test
    void isAuthorized_account_true() {
        assertTrue(regulatorCompAuthAuthorizationService.isAuthorized(user, CompetentAuthorityEnum.ENGLAND));
    }

    @Test
    void isAuthorized_account_false() {
        assertFalse(regulatorCompAuthAuthorizationService.isAuthorized(user, CompetentAuthorityEnum.SCOTLAND));
    }

    @Test
    void isAuthorized_account_with_permissions_true() {
        assertTrue(regulatorCompAuthAuthorizationService.isAuthorized(user, CompetentAuthorityEnum.ENGLAND,
                Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK));
    }

    @Test
    void isAuthorized_account_with_permissions_false() {
        assertFalse(regulatorCompAuthAuthorizationService.isAuthorized(user, CompetentAuthorityEnum.ENGLAND,
                Permission.PERM_ORGANISATION_ACCOUNT_OPENING_ARCHIVE_VIEW_TASK));
    }

    @Test
    void getType() {
        assertEquals(RoleType.REGULATOR, regulatorCompAuthAuthorizationService.getRoleType());
    }
}