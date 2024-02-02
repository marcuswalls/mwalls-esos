package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountSearchResultsInfoDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.organisation.transform.OrganisationAccountMapper;
import uk.gov.esos.api.account.service.VerifierAccountAccessByAccountTypeService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganisationAccountQueryService {

    private final OrganisationAccountRepository repository;
    private final VerifierAccountAccessByAccountTypeService verifierAccountAccessService;

    private static final OrganisationAccountMapper organisationAccountMapper = Mappers.getMapper(OrganisationAccountMapper.class);

    public AccountSearchResults<OrganisationAccountSearchResultsInfoDTO> getAccountsByUserAndSearchCriteria(AppUser user, AccountSearchCriteria searchCriteria) {
        return switch (user.getRoleType()) {
            case OPERATOR -> repository.findByAccountIds(List.copyOf(user.getAccounts()), searchCriteria);
            case REGULATOR -> repository.findByCompAuth(user.getCompetentAuthority(), searchCriteria);
            case VERIFIER -> {
                final Set<Long> accounts = verifierAccountAccessService.findAuthorizedAccountIds(user, AccountType.ORGANISATION);
                if (accounts.isEmpty()) {
                    AccountSearchResults.AccountSearchResultsBuilder<OrganisationAccountSearchResultsInfoDTO> builder = AccountSearchResults.builder();
                    yield builder.total(0L).accounts(new ArrayList<>()).build();
                } else {
                    yield repository.findByAccountIds(new ArrayList<>(accounts), searchCriteria);
                }
            }
        };
    }

    OrganisationAccount getAccountById(Long accountId) {
        return repository.findById(accountId)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public OrganisationAccountDTO getOrganisationAccountById(Long accountId) {
        OrganisationAccount account = getAccountById(accountId);
        return organisationAccountMapper.toOrganisationAccountDTO(account);
    }

    public List<OrganisationAccountDTO> getAccountsByIds(List<Long> accountIds) {
        return repository.findAllByIdIn(accountIds)
            .stream()
            .map(organisationAccountMapper::toOrganisationAccountDTO)
            .collect(Collectors.toList());
    }
}
