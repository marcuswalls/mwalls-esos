package uk.gov.esos.api.account.service.validator;

import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.authorization.AuthorityConstants;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@Component
@RequiredArgsConstructor
public class PrimaryContactValidator implements AccountContactTypeUpdateValidator, AccountContactTypeDeleteValidator {

    private final AuthorityService authorityService;

    @Override
    public void validateUpdate(Map<AccountContactType, String> contactTypes, Long accountId) {
        String userId = contactTypes.get(AccountContactType.PRIMARY);

        if(userId == null) {
            throw new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_IS_REQUIRED);
        }

        Optional<AuthorityInfoDTO> userAccountAuthorityOptional =
            authorityService.findAuthorityByUserIdAndAccountId(userId, accountId);

        userAccountAuthorityOptional.ifPresent(userAccountAuthority -> {
                if(AuthorityConstants.OPERATOR_ROLE_CODE.equals(userAccountAuthority.getCode())) {
                    throw new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_OPERATOR);
                }
            }
        );
    }

    @Override
    public void validateDelete(Map<AccountContactType, String> contactTypes) {
        String userId = contactTypes.get(AccountContactType.PRIMARY);
        if(userId == null) {
            throw new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_IS_REQUIRED);
        }
    }
}
