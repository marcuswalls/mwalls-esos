package uk.gov.esos.api.user.regulator.service;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.service.UserSignatureValidatorService;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.core.service.auth.UserRegistrationService;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDetailsDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.transform.RegulatorInviteUserMapper;
import uk.gov.esos.api.user.regulator.transform.RegulatorUserMapper;

@Service
@RequiredArgsConstructor
public class RegulatorUserAuthService {

	private final AuthService authService;
    private final UserRegistrationService userRegistrationService;
    private final UserSignatureValidatorService userSignatureValidatorService;
    
    private final RegulatorUserMapper regulatorUserMapper;
    private final RegulatorInviteUserMapper regulatorInviteUserMapper;
    
    public RegulatorUserDTO getRegulatorUserById(String userId) {
        UserRepresentation userRep = authService.getUserRepresentationById(userId);
        return regulatorUserMapper.toRegulatorUserDTO(
                userRep, 
                authService.getUserDetails(userId).map(UserDetails::getSignature).orElse(null)
                );
    }
    
    public String registerRegulatorInvitedUser(RegulatorInvitedUserDetailsDTO regulatorUserInvitation, FileDTO signature) {
        userSignatureValidatorService.validateSignature(signature);
        
        UserRepresentation newUserRepresentation = regulatorInviteUserMapper.toUserRepresentation(regulatorUserInvitation);
        return userRegistrationService.registerInvitedUser(newUserRepresentation);
    }
    
    public void updateRegulatorUser(String userId, RegulatorUserDTO newRegulatorUserDTO, FileDTO signature) {
        userSignatureValidatorService.validateSignature(signature);
        
        UserRepresentation registeredUser = authService.getUserRepresentationById(userId);
        
        UserRepresentation updatedUser = regulatorUserMapper.toUserRepresentation(newRegulatorUserDTO, userId,
                registeredUser.getUsername(), registeredUser.getEmail(), registeredUser.getAttributes());
        authService.updateUser(updatedUser);
    }
    
}
