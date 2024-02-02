package uk.gov.esos.api.authorization.rules.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.authorization.core.domain.Permission;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorizationRuleScopePermission {
    
    private String resourceSubType;
    private String handler;
    private Permission permission;
}
