package uk.gov.esos.api.workflow.request.core.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface OrganisationAccountDetailsMapper {

    OrganisationParticipantDetails toOrganisationParticipantDetails(OperatorUserDTO operatorUser);

    OrganisationDetails toOrganisationDetails(OrganisationAccountDTO organisationAccount);
}
