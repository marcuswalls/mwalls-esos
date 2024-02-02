package uk.gov.esos.api.user.verifier.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.verifier.service.VerifierAuthorityService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.service.UserSecuritySetupService;
import uk.gov.esos.api.user.verifier.domain.VerifierUserDTO;

@Service
@RequiredArgsConstructor
public class VerifierUserManagementService {
	
	private final VerifierAuthorityService verifierAuthorityService;
	private final VerifierUserAuthService verifierUserAuthService;
	private final UserSecuritySetupService userSecuritySetupService;

	public VerifierUserDTO getVerifierUserById(AppUser user, String userId) {
        validateUserBasedOnAuthUserRole(user, userId);
		return verifierUserAuthService.getVerifierUserById(userId);
	}

	public void updateVerifierUserById(AppUser pmrvUser, String userId, VerifierUserDTO verifierUserDTO) {
	    validateUserBasedOnAuthUserRole(pmrvUser, userId);
		verifierUserAuthService.updateVerifierUser(userId, verifierUserDTO);
	}

	public void updateCurrentVerifierUser(AppUser pmrvUser, VerifierUserDTO verifierUserDTO) {
		verifierUserAuthService.updateVerifierUser(pmrvUser.getUserId(), verifierUserDTO);
	}
	
	public void resetVerifier2Fa(AppUser pmrvUser, String userId) {
		validateUserBasedOnAuthUserRole(pmrvUser, userId);
		userSecuritySetupService.resetUser2Fa(userId);
	}

	private void validateUserBasedOnAuthUserRole(AppUser pmrvUser, String userId) {
        switch (pmrvUser.getRoleType()) {
            case REGULATOR:
                validateUserIsVerifier(userId);
                break;
            case VERIFIER:
                validateUserHasAccessToVerificationBody(pmrvUser, userId);
                break;
            default:
                throw new UnsupportedOperationException(
                    String.format("User with role type %s can not access verifier user", pmrvUser.getRoleType()));
        }
    }

	/** Validate if user has access to queried user's verification body. */
	private void validateUserHasAccessToVerificationBody(AppUser pmrvUser, String userId) {
		Long verificationBodyId = pmrvUser.getVerificationBodyId();

		if(!verifierAuthorityService.existsByUserIdAndVerificationBodyId(userId, verificationBodyId)){
			throw new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_VERIFICATION_BODY);
		}
	}

	private void validateUserIsVerifier(String userId) {
        if(!verifierAuthorityService.existsByUserIdAndVerificationBodyIdNotNull(userId)) {
            throw new BusinessException(ErrorCode.AUTHORITY_USER_IS_NOT_VERIFIER);
        }
    }
}
