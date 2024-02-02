package uk.gov.esos.api.account.service;

import org.springframework.data.domain.Page;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.dto.AccountContactInfoDTO;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

public interface ApprovedAccountTypeQueryService {

    List<Long> getAllApprovedAccountIdsByCa(CompetentAuthorityEnum competentAuthority);

    Page<AccountContactInfoDTO> getApprovedAccountsAndCaSiteContactsByCa(CompetentAuthorityEnum competentAuthority, Integer page, Integer pageSize);

    boolean isAccountApproved(Account account);

    AccountType getAccountType();
}
