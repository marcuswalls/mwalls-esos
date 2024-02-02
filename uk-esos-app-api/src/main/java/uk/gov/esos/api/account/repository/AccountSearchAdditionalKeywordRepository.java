package uk.gov.esos.api.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.esos.api.account.domain.AccountSearchAdditionalKeyword;

public interface AccountSearchAdditionalKeywordRepository extends JpaRepository<AccountSearchAdditionalKeyword, Long> {
}
