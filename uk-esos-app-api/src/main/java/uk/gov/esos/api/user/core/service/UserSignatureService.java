package uk.gov.esos.api.user.core.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.token.UserFileTokenService;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@Service
@RequiredArgsConstructor
public class UserSignatureService {

    private final UserAuthService userAuthService;
    private final UserFileTokenService userFileTokenService;
    
    @Transactional
    public FileToken generateSignatureFileToken(String userId, UUID signatureUuid) {
        UserDetails userDetails = userAuthService.getUserDetails(userId).orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        
        if(userDetails.getSignature() == null) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        
        if(!signatureUuid.toString().equals(userDetails.getSignature().getUuid())){
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        
        return userFileTokenService.generateGetFileToken(signatureUuid.toString());
    }
    
    @Transactional(readOnly = true)
    public FileDTO getSignatureFileDTOByToken(String getFileToken) {
        String fileUuid = userFileTokenService.resolveGetFileUuid(getFileToken);
        return userAuthService.getUserSignature(fileUuid).orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
    
}
