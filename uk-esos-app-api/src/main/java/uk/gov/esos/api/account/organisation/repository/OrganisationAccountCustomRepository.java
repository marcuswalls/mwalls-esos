package uk.gov.esos.api.account.organisation.repository;

import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountSearchResultsInfoDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

public interface OrganisationAccountCustomRepository {

    @Transactional(readOnly = true)
    AccountSearchResults<OrganisationAccountSearchResultsInfoDTO> findByAccountIds(List<Long> accountIds, AccountSearchCriteria searchCriteria);

    @Transactional(readOnly = true)
    AccountSearchResults<OrganisationAccountSearchResultsInfoDTO> findByCompAuth(CompetentAuthorityEnum compAuth, AccountSearchCriteria searchCriteria);
}
