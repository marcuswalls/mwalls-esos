package uk.gov.esos.api.workflow.request.core.service;

import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.account.service.AccountContactQueryService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.transform.OrganisationAccountDetailsMapper;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserAuthService;

import java.util.Optional;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class OrganisationAccountDetailsQueryService {

    private final OperatorUserAuthService operatorUserAuthService;
    private final OrganisationAccountQueryService organisationAccountQueryService;
    private final AccountContactQueryService accountContactQueryService;
    private static final OrganisationAccountDetailsMapper ORGANISATION_ACCOUNT_DETAILS_MAPPER = Mappers
            .getMapper(OrganisationAccountDetailsMapper.class);

    public OrganisationParticipantDetails getOrganisationParticipantDetails(String userId) {
        OperatorUserDTO operatorUserDTO = operatorUserAuthService.getOperatorUserById(userId);

        return ORGANISATION_ACCOUNT_DETAILS_MAPPER.toOrganisationParticipantDetails(operatorUserDTO);
    }

    public OrganisationDetails getOrganisationDetails(Long accountId) {
        OrganisationAccountDTO organisationAccount = organisationAccountQueryService.getOrganisationAccountById(accountId);

        return ORGANISATION_ACCOUNT_DETAILS_MAPPER.toOrganisationDetails(organisationAccount);
    }

    public OrganisationParticipantDetails getOrganisationPrimaryContactParticipantDetails(Long accountId) {
        return accountContactQueryService.findPrimaryContactByAccount(accountId)
                .map(this::getOrganisationParticipantDetails)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    public Optional<OrganisationParticipantDetails> getOrganisationSecondaryContactParticipantDetails(Long accountId) {
        return accountContactQueryService.findContactByAccountAndContactType(accountId, AccountContactType.SECONDARY)
                .map(this::getOrganisationParticipantDetails);
    }
}
