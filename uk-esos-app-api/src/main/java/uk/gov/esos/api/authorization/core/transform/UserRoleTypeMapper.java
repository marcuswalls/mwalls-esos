package uk.gov.esos.api.authorization.core.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.authorization.core.domain.UserRoleType;
import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

/**
 * Mapper for {@link UserRoleType} objects.
 */
@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface UserRoleTypeMapper {

    UserRoleTypeDTO toUserRoleTypeDTO(UserRoleType userRoleType);
}
