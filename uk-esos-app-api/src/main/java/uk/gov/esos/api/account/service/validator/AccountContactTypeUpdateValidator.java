package uk.gov.esos.api.account.service.validator;

import java.util.Map;

import uk.gov.esos.api.account.domain.enumeration.AccountContactType;

public interface AccountContactTypeUpdateValidator {
    
    void validateUpdate(Map<AccountContactType, String> contactTypes, Long accountId);
}
