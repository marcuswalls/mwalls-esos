package uk.gov.esos.api.account.organisation.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.organisation.transform.OrganisationAccountMapper;
import uk.gov.esos.api.common.exception.BusinessException;

import java.util.ArrayList;
import java.util.List;

import static uk.gov.esos.api.common.exception.ErrorCode.ACCOUNT_FIELD_NOT_AMENDABLE;

@Validated
@Service
@RequiredArgsConstructor
public class OrganisationAccountAmendService {

    private final OrganisationAccountQueryService organisationAccountQueryService;
    private final OrganisationAccountRepository organisationAccountRepository;
    private static final OrganisationAccountMapper ORGANISATION_ACCOUNT_MAPPER = Mappers.getMapper(OrganisationAccountMapper.class);

    @Transactional
    public void amendAccount(Long accountId, @Valid OrganisationAccountDTO updatedAccountDTO) {
        OrganisationAccount existingAccount = organisationAccountQueryService.getAccountById(accountId);
        OrganisationAccountDTO existingAccountDTO = ORGANISATION_ACCOUNT_MAPPER.toOrganisationAccountDTO(existingAccount);

        validateNonAmendableAccountFields(existingAccountDTO, updatedAccountDTO);

        OrganisationAccount updatedAccount = ORGANISATION_ACCOUNT_MAPPER.toOrganisationAccount(updatedAccountDTO,
                existingAccount.getId(),
                existingAccount.getOrganisationId(),
                existingAccount.getAccountType(),
                existingAccount.getStatus()
            );

        organisationAccountRepository.save(updatedAccount);
    }

    private void validateNonAmendableAccountFields(OrganisationAccountDTO existingAccountDTO, OrganisationAccountDTO updatedAccountDTO) {
        List<String> errors = new ArrayList<>();

        if (!existingAccountDTO.getCompetentAuthority().equals(updatedAccountDTO.getCompetentAuthority())) {
            errors.add("competentAuthority");
        }

        if (!errors.isEmpty()) {
            throw new BusinessException(ACCOUNT_FIELD_NOT_AMENDABLE, errors.toArray());
        }
    }
}
