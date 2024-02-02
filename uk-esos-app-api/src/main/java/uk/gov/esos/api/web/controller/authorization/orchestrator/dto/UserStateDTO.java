package uk.gov.esos.api.web.controller.authorization.orchestrator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.enumeration.RoleType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStateDTO {

    private String userId;

    private RoleType roleType;

    private LoginStatus status;
}
