package uk.gov.esos.api.user.regulator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.service.UserSecuritySetupService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserUpdateDTO;

@Service
@RequiredArgsConstructor
public class RegulatorUserManagementService {

    private final RegulatorUserAuthService regulatorUserAuthService;

    private final RegulatorAuthorityService regulatorAuthorityService;
    
    private final UserSecuritySetupService userSecuritySetupService;

    public RegulatorUserDTO getRegulatorUserByUserId(AppUser user, String userId) {
        // Validate
        validateRegulatorUser(user, userId);

        return regulatorUserAuthService.getRegulatorUserById(userId);
    }

    @Transactional
    public void updateRegulatorUserByUserId(AppUser pmrvUser, String userId, RegulatorUserDTO regulatorUserUpdateDTO, FileDTO signature) {
        validateRegulatorUser(pmrvUser, userId);

        regulatorUserAuthService.updateRegulatorUser(userId, regulatorUserUpdateDTO, signature);
    }

    @Transactional
    public void updateCurrentRegulatorUser(AppUser pmrvUser, RegulatorUserUpdateDTO regulatorUserUpdateDTO, FileDTO signature) {
        regulatorUserAuthService.updateRegulatorUser(pmrvUser.getUserId(), regulatorUserUpdateDTO.getUser(), signature);
    }

	public void resetRegulator2Fa(AppUser pmrvUser, String userId) {
		validateRegulatorUser(pmrvUser, userId);
		userSecuritySetupService.resetUser2Fa(userId);
	}
	
	private void validateRegulatorUser(AppUser pmrvUser, String userId) {
		if (!regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, pmrvUser.getCompetentAuthority())) {
            throw new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA);
        }
	}
}
