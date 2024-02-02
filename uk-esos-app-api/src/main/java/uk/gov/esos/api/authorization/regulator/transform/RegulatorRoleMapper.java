package uk.gov.esos.api.authorization.regulator.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.gov.esos.api.authorization.core.domain.RolePermission;
import uk.gov.esos.api.authorization.core.domain.dto.RolePermissionsDTO;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorRolePermissionsDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RegulatorRoleMapper {

    @Mapping(source = "rolePermissions", target = "rolePermissions", qualifiedByName = "permissionToPermissionGroupLevel")
    RegulatorRolePermissionsDTO toRolePermissionsDTO(RolePermissionsDTO role);

    @Named("permissionToPermissionGroupLevel")
    default Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionToPermission(
        List<RolePermission> rolePermissions) {
        return RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(
            rolePermissions.stream().map(RolePermission::getPermission)
                .collect(Collectors.toList()));
    }
}
