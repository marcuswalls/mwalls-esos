package uk.gov.esos.api.workflow.request.flow.esos.item.transform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.domain.transform.AddressMapper;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemAssigneeDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class OrganisationItemMapperTest {

    private OrganisationItemMapper mapper = Mappers.getMapper(OrganisationItemMapper.class);


    @Test
    void accountToItemOrganisationAccountDTO() {
        Long id = 1L;
        String name = "name";
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        String registrationNbr = "registrationNbr";
        String organisationId = "ORG01";
        OrganisationAccountDTO accountDTO = OrganisationAccountDTO.builder()
            .id(id)
            .name(name)
            .competentAuthority(ca)
            .registrationNumber(registrationNbr)
            .organisationId(organisationId)
            .build();

        ItemOrganisationAccountDTO expectedItem = ItemOrganisationAccountDTO.builder()
            .accountId(id)
            .accountName(name)
            .competentAuthority(ca)
            .accountRegistrationNumber(registrationNbr)
            .accountOrganisationId(organisationId)
            .build();

        ItemOrganisationAccountDTO actualItem = mapper.accountToItemOrganisationAccountDTO(accountDTO);

        assertEquals(expectedItem, actualItem);
    }

    @Test
    void itemToItemOrganisationDTO() {
        LocalDateTime itemCreationDate = LocalDateTime.now();
        String requestId = "REQ-1";
        RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
        Long accountId = 1L;
        Long requestTaskId = 15L;
        RequestTaskType requestTaskType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;
        String taskAssigneeId = "userId";

        Item item = Item.builder()
            .creationDate(itemCreationDate)
            .requestId(requestId)
            .requestType(requestType)
            .accountId(accountId)
            .taskId(requestTaskId)
            .taskType(requestTaskType)
            .taskAssigneeId(taskAssigneeId)
            .build();

        UserInfoDTO taskAssignee = UserInfoDTO.builder().firstName("fname").lastName("lname").build();
        RoleType taskAssigneeType = RoleType.REGULATOR;
        ItemOrganisationAccountDTO account = ItemOrganisationAccountDTO.builder()
            .accountId(accountId)
            .accountName("name")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .accountRegistrationNumber("regNbr")
            .accountOrganisationId("orgId")
            .build();

        ItemOrganisationDTO expectedItem = ItemOrganisationDTO.builder()
            .creationDate(itemCreationDate)
            .requestId(requestId)
            .requestType(requestType)
            .taskId(requestTaskId)
            .itemAssignee(ItemAssigneeDTO.builder().taskAssignee(taskAssignee).taskAssigneeType(taskAssigneeType).build())
            .taskType(requestTaskType)
            .isNew(false)
            .account(account)
            .build();

        ItemOrganisationDTO actualItem = mapper.itemToItemOrganisationDTO(item, taskAssignee, taskAssigneeType, account);

        assertEquals(expectedItem, actualItem);
    }
}