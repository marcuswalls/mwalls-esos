package uk.gov.esos.api.user.regulator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserInfoDTO;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegulatorUserInfoServiceTest {
    @InjectMocks
    private RegulatorUserInfoService regulatorUserInfoService;

    @Mock
    private CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;

    @Mock
    private UserAuthService userAuthService;

    @Test
    void getRegulatorUsersInfo() {
        AppUser pmrvUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();
        RegulatorUserInfoDTO regulatorUserInfoDTO = RegulatorUserInfoDTO.builder()
                .id("user1")
                .firstName("name")
                .lastName("lastName")
                .jobTitle("title")
                .enabled(true)
                .build();
        when(compAuthAuthorizationResourceService.hasUserScopeToCompAuth(pmrvUser, Scope.EDIT_USER)).thenReturn(true);
        when(userAuthService.getUsersWithAttributes(List.of("user1"), RegulatorUserInfoDTO.class)).thenReturn(List.of(regulatorUserInfoDTO));
        List<RegulatorUserInfoDTO> regulatorUsersInfo = regulatorUserInfoService.getRegulatorUsersInfo(pmrvUser, List.of("user1"));
        assertEquals(regulatorUsersInfo, List.of(regulatorUserInfoDTO));
    }

    @Test
    void getRegulatorUsersInfo_no_edit() {
        AppUser pmrvUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();
        RegulatorUserInfoDTO regulatorUserInfoDTO = RegulatorUserInfoDTO.builder()
                .id("user1")
                .firstName("name")
                .lastName("lastName")
                .jobTitle("title")
                .enabled(null)
                .build();
        when(compAuthAuthorizationResourceService.hasUserScopeToCompAuth(pmrvUser, Scope.EDIT_USER)).thenReturn(false);
        when(userAuthService.getUsersWithAttributes(List.of("user1"), RegulatorUserInfoDTO.class)).thenReturn(List.of(regulatorUserInfoDTO));
        List<RegulatorUserInfoDTO> regulatorUsersInfo = regulatorUserInfoService.getRegulatorUsersInfo(pmrvUser, List.of("user1"));
        assertEquals(regulatorUsersInfo, List.of(regulatorUserInfoDTO));
    }
}