package uk.gov.esos.api.authorization.regulator.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthoritiesDTO;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.authorization.core.repository.AuthorityRepository;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.authorization.core.transform.UserAuthorityMapper;
import uk.gov.esos.api.authorization.regulator.domain.AuthorityManagePermissionDTO;
import uk.gov.esos.api.authorization.regulator.transform.RegulatorPermissionsAdapter;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegulatorAuthorityQueryService {

    private final AuthorityRepository authorityRepository;
    private final AuthorityService authorityService;
    private final CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;
    private final UserAuthorityMapper userAuthorityMapper = Mappers.getMapper(UserAuthorityMapper.class);

    /**
     * Returns the current regulator user permissions. Authenticated user should belong to same CA.
     *
     * @param pmrvUser {@link AppUser}
     * @return {@link AuthorityManagePermissionDTO}
     */
    public AuthorityManagePermissionDTO getCurrentRegulatorUserPermissions(AppUser pmrvUser) {
        List<Permission> permissions = authorityService.getAuthoritiesByUserId(pmrvUser.getUserId()).stream()
            .map(AuthorityDTO::getAuthorityPermissions)
            .flatMap(List::stream)
            .collect(Collectors.toList());


        return AuthorityManagePermissionDTO.builder()
            .permissions(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .editable(compAuthAuthorizationResourceService.hasUserScopeToCompAuth(pmrvUser, Scope.EDIT_USER))
            .build();
    }

    /**
     * Returns the regulator user permissions. User being accessed should belong to CA.
     *
     * @param authUser {@link AppUser}
     * @param userId Keycloak user id
     * @return {@link AuthorityManagePermissionDTO}
     */
    public AuthorityManagePermissionDTO getRegulatorUserPermissionsByUserId(AppUser authUser, String userId) {
        CompetentAuthorityEnum ca = authUser.getCompetentAuthority();

        // Validate
        if (!authorityRepository.existsByUserIdAndCompetentAuthority(userId, ca)) {
            throw new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA);
        }

        List<Permission> permissions = authorityService.getAuthoritiesByUserId(userId).stream()
            .map(AuthorityDTO::getAuthorityPermissions)
            .flatMap(List::stream)
            .collect(Collectors.toList());

        return AuthorityManagePermissionDTO.builder()
            .permissions(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .editable(true).build();
    }

    /**
     * Returns information about regulator users and their authorities.
     * Regulator users that are fetched belong to the same competent authority with the {@code pmrvUser}
     * @param pmrvUser the authenticated {@link AppUser}
     * @return {@link UserAuthoritiesDTO}
     */
    public UserAuthoritiesDTO getCaAuthorities(AppUser pmrvUser) {
        boolean hasEditUserScopeOnCa = compAuthAuthorizationResourceService.hasUserScopeToCompAuth(pmrvUser, Scope.EDIT_USER);

        List<Authority> regulatorUserAuthorities = hasEditUserScopeOnCa ?
            findRegulatorUserAuthoritiesByCa(pmrvUser.getCompetentAuthority()) :
            findNonPendingRegulatorUserAuthoritiesByCa(pmrvUser.getCompetentAuthority());

        List<UserAuthorityDTO> caUserAuthorities = regulatorUserAuthorities.stream()
                .map(authority -> userAuthorityMapper.toUserAuthority(authority, hasEditUserScopeOnCa))
                .collect(Collectors.toList());

        return UserAuthoritiesDTO.builder()
                .authorities(caUserAuthorities)
                .editable(hasEditUserScopeOnCa)
                .build();
    }

    private List<Authority> findRegulatorUserAuthoritiesByCa(CompetentAuthorityEnum competentAuthority) {
        return authorityRepository.findByCompetentAuthority(competentAuthority);
    }

    private List<Authority> findNonPendingRegulatorUserAuthoritiesByCa(CompetentAuthorityEnum competentAuthority) {
        return authorityRepository.findByCompetentAuthorityAndStatusNot(competentAuthority, AuthorityStatus.PENDING);
    }
}
