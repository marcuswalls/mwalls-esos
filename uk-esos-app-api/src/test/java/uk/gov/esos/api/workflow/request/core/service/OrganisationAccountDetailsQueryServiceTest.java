package uk.gov.esos.api.workflow.request.core.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.account.service.AccountContactQueryService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserAuthService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountDetailsQueryServiceTest {

    @InjectMocks
    private OrganisationAccountDetailsQueryService service;

    @Mock
    private OperatorUserAuthService operatorUserAuthService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

    @Mock
    private AccountContactQueryService accountContactQueryService;

    @Test
    void getOrganisationParticipantDetails() {
        final String userId = "userId";
        final OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();
        final OrganisationParticipantDetails expected = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        when(operatorUserAuthService.getOperatorUserById(userId)).thenReturn(operatorUserDTO);

        // Invoke
        OrganisationParticipantDetails actual = service.getOrganisationParticipantDetails(userId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(operatorUserAuthService, times(1)).getOperatorUserById(userId);
    }

    @Test
    void getOrganisationDetails() {
        final long accountId = 1L;
        final OrganisationAccountDTO organisationAccount = OrganisationAccountDTO.builder()
                .name("Name")
                .registrationNumber("R8282")
                .build();
        final OrganisationDetails expected = OrganisationDetails.builder()
                .name("Name")
                .registrationNumber("R8282")
                .build();

        when(organisationAccountQueryService.getOrganisationAccountById(accountId)).thenReturn(organisationAccount);

        // Invoke
        OrganisationDetails actual = service.getOrganisationDetails(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(organisationAccountQueryService, times(1)).getOrganisationAccountById(accountId);
    }

    @Test
    void getOrganisationPrimaryContactParticipantDetails() {
        final long accountId = 1L;
        final String userId = "userId";
        final OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        final OrganisationParticipantDetails expected = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        when(accountContactQueryService.findPrimaryContactByAccount(accountId)).thenReturn(Optional.of(userId));
        when(operatorUserAuthService.getOperatorUserById(userId)).thenReturn(operatorUserDTO);

        // Invoke
        OrganisationParticipantDetails actual = service.getOrganisationPrimaryContactParticipantDetails(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(accountContactQueryService, times(1)).findPrimaryContactByAccount(accountId);
        verify(operatorUserAuthService, times(1)).getOperatorUserById(userId);
    }

    @Test
    void getOrganisationPrimaryContactParticipantDetails_not_found() {
        final long accountId = 1L;

        when(accountContactQueryService.findPrimaryContactByAccount(accountId)).thenReturn(Optional.empty());

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class, () ->
                service.getOrganisationPrimaryContactParticipantDetails(accountId));

        // Verify
        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(accountContactQueryService, times(1)).findPrimaryContactByAccount(accountId);
        verify(operatorUserAuthService, never()).getOperatorUserById(anyString());
    }

    @Test
    void getOrganisationSecondaryContactParticipantDetails() {
        final long accountId = 1L;
        final String userId = "userId";
        final OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        final OrganisationParticipantDetails expected = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        when(accountContactQueryService.findContactByAccountAndContactType(accountId, AccountContactType.SECONDARY))
                .thenReturn(Optional.of(userId));
        when(operatorUserAuthService.getOperatorUserById(userId)).thenReturn(operatorUserDTO);

        // Invoke
        Optional<OrganisationParticipantDetails> actual = service.getOrganisationSecondaryContactParticipantDetails(accountId);

        // Verify
        assertThat(actual).isPresent().contains(expected);
        verify(accountContactQueryService, times(1))
                .findContactByAccountAndContactType(accountId, AccountContactType.SECONDARY);
        verify(operatorUserAuthService, times(1)).getOperatorUserById(userId);
    }
}
