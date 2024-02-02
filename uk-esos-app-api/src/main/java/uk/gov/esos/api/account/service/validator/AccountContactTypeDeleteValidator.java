package uk.gov.esos.api.account.service.validator;

import java.util.Map;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;

public interface AccountContactTypeDeleteValidator {

    void validateDelete(Map<AccountContactType, String> contactTypes);
}
