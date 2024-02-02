package uk.gov.esos.api.account.repository;

import uk.gov.esos.api.account.domain.Account;

import java.util.Optional;

public interface AccountCustomRepository {
    Optional<Account> findByIdForUpdate(Long id);
}
