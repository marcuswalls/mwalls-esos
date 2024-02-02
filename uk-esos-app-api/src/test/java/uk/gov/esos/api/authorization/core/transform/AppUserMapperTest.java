package uk.gov.esos.api.authorization.core.transform;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.AccessToken;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Map;

import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;

@ExtendWith(MockitoExtension.class)
class AppUserMapperTest {

    private final AppUserMapperImpl pmrvUserMapper = new AppUserMapperImpl();

    @Test
    void toPmrvUser() {
        AuthorityDTO accountAuthority = buildAccountAuthority();
        AuthorityDTO caAuthority = buildCaAuthority();
        AccessToken accessToken = buildAccessToken();
        RoleType roleType = RoleType.OPERATOR;

        AppUser expectedUser = getExpectedPmrvUser(accountAuthority, caAuthority, accessToken, roleType);

        //PmrvUser pmrvUser = pmrvUserMapper.toPmrvUser(accessToken, List.of(accountAuthority, caAuthority), roleType);

        //assertEquals(expectedPmrvUser, pmrvUser);
    }

    @Test
    void toPmrvUser_no_authorities() {
        AccessToken accessToken = buildAccessToken();
        RoleType roleType = RoleType.OPERATOR;

        AppUser expectedUser = AppUser.builder()
            .userId(accessToken.getSubject())
            .firstName(accessToken.getGivenName())
            .lastName(accessToken.getFamilyName())
            .email(accessToken.getEmail())
            .roleType(roleType)
            .build();

        //PmrvUser pmrvUser = pmrvUserMapper.toPmrvUser(accessToken, Collections.emptyList(), roleType);

        //assertEquals(expectedPmrvUser, pmrvUser);
    }

    private AppUser getExpectedPmrvUser(AuthorityDTO accountAuthority, AuthorityDTO caAuthority, AccessToken accessToken, RoleType roleType) {
        return AppUser.builder()
                .userId(accessToken.getSubject())
                .firstName(accessToken.getGivenName())
                .lastName(accessToken.getFamilyName())
                .email(accessToken.getEmail())
                .roleType(roleType)
                .authorities(List.of(
                        AppAuthority.builder()
                                .code(accountAuthority.getCode())
                                .accountId(accountAuthority.getAccountId())
                                .permissions(accountAuthority.getAuthorityPermissions())
                                .build(),
                        AppAuthority.builder()
                                .code(caAuthority.getCode())
                                .competentAuthority(caAuthority.getCompetentAuthority())
                                .permissions(caAuthority.getAuthorityPermissions())
                                .build()))
                .build();
    }

    private AuthorityDTO buildCaAuthority() {
        return AuthorityDTO.builder()
                .code("code2")
                .competentAuthority(CompetentAuthorityEnum.SCOTLAND)
                .authorityPermissions(List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK))
                .build();
    }

    private AuthorityDTO buildAccountAuthority() {
        return AuthorityDTO.builder()
                .code("code1")
                .accountId(1L)
                .authorityPermissions(List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK))
                .build();
    }

    private AccessToken buildAccessToken() {
        Map<String, String> token = Map.of("sub", "userId", "email", "user@email.com", "given_name", "name", "family_name", "surname");
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(token, AccessToken.class);
    }
}