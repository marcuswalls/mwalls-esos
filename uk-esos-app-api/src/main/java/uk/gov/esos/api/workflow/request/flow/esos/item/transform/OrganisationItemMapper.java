package uk.gov.esos.api.workflow.request.flow.esos.item.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface OrganisationItemMapper {

    @Mapping(target = "accountId", source = "id")
    @Mapping(target = "accountName", source = "name")
    @Mapping(target = "accountOrganisationId", source = "organisationId")
    @Mapping(target = "accountRegistrationNumber", source = "registrationNumber")
    ItemOrganisationAccountDTO accountToItemOrganisationAccountDTO(OrganisationAccountDTO accountDTO);

    @Mapping(target = "itemAssignee.taskAssignee", source = "taskAssignee")
    @Mapping(target = "itemAssignee.taskAssigneeType", source = "taskAssigneeType")
    @Mapping(target = "daysRemaining", expression = "java(uk.gov.esos.api.workflow.utils.DateUtils.getDaysRemaining(item.getPauseDate(), item.getTaskDueDate()))")
    ItemOrganisationDTO itemToItemOrganisationDTO(Item item, UserInfoDTO taskAssignee, RoleType taskAssigneeType, ItemOrganisationAccountDTO account);
}
