package uk.gov.esos.api.account.service;

import java.util.Set;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;

public interface VerifierAccountAccessByAccountTypeService {

    Set<Long> findAuthorizedAccountIds(AppUser user, AccountType accountType);
}