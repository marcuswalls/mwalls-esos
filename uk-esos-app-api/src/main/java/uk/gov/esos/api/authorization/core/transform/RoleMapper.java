package uk.gov.esos.api.authorization.core.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.authorization.core.domain.Role;
import uk.gov.esos.api.authorization.core.domain.dto.RoleDTO;
import uk.gov.esos.api.authorization.core.domain.dto.RolePermissionsDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RoleMapper {

    RoleDTO toRoleDTO(Role role);
    RolePermissionsDTO toRolePermissionsDTO(Role role);

}
