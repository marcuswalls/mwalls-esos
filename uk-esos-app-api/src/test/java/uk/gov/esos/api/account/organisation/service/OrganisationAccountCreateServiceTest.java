package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountCreateServiceTest {

    @InjectMocks
    private OrganisationAccountCreateService service;

    @Mock
    private OrganisationAccountRepository organisationAccountRepository;

    @Test
    void createOrganisationAccount() {
        Long accountId = 10L;
        OrganisationAccountDTO accountCreationDTO = OrganisationAccountDTO.builder()
                .name("name")
                .status(OrganisationAccountStatus.LIVE)
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .registrationNumber("number")
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .build();

        when(organisationAccountRepository.generateId()).thenReturn(accountId);
        when(organisationAccountRepository.save(ArgumentMatchers.any(OrganisationAccount.class)))
            .then(invocationOnMock -> invocationOnMock.getArgument(0));

        //invoke
        OrganisationAccountDTO response = service.createOrganisationAccount(accountCreationDTO);

        //verify
        assertEquals("ORG000010", response.getOrganisationId());
        assertEquals(accountCreationDTO.getRegistrationNumber(), response.getRegistrationNumber());
        assertEquals(accountCreationDTO.getName(), response.getName());
        assertEquals(accountCreationDTO.getCompetentAuthority(), response.getCompetentAuthority());
        assertEquals(accountCreationDTO.getAddress(), response.getAddress());
        assertEquals(OrganisationAccountStatus.UNAPPROVED, response.getStatus());

        verify(organisationAccountRepository).generateId();
        verify(organisationAccountRepository).save(ArgumentMatchers.any(OrganisationAccount.class));
    }
}