package uk.gov.esos.api.account.organisation.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.repository.AccountBaseRepository;

import java.util.Optional;

import java.util.List;

@Repository
public interface OrganisationAccountRepository
        extends AccountBaseRepository<OrganisationAccount>,
        OrganisationAccountCustomRepository {

    @Query(nativeQuery = true, value = "SELECT NEXTVAL('account_organisation_seq')")
    Long generateId();

    @Transactional(readOnly = true)
    List<OrganisationAccount> findAllByIdIn(List<Long> ids);
}