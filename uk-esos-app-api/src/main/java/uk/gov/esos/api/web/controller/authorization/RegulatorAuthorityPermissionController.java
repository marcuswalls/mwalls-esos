package uk.gov.esos.api.web.controller.authorization;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.authorization.regulator.domain.AuthorityManagePermissionDTO;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityQueryService;
import uk.gov.esos.api.authorization.regulator.transform.RegulatorPermissionsAdapter;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.security.AuthorizedRole;

import java.util.List;
import java.util.Map;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.AUTHORITY_USER_NOT_RELATED_TO_CA;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/regulator-authorities/permissions")
@Tag(name = "Regulator Authorities")
@RequiredArgsConstructor
public class RegulatorAuthorityPermissionController {

    private final RegulatorAuthorityQueryService regulatorAuthorityQueryService;

    @GetMapping
    @Operation(summary = "Retrieves the current regulator user's permissions")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AuthorityManagePermissionDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.REGULATOR)
    public ResponseEntity<AuthorityManagePermissionDTO> getCurrentRegulatorUserPermissionsByCa(@Parameter(hidden = true) AppUser currentUser) {
        return new ResponseEntity<>(regulatorAuthorityQueryService.getCurrentRegulatorUserPermissions(currentUser),
                HttpStatus.OK);
    }

    @GetMapping(path = "/{userId}")
    @Operation(summary = "Retrieves the regulator user's permissions")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AuthorityManagePermissionDTO.class))})
    @ApiResponse(responseCode = "400", description = AUTHORITY_USER_NOT_RELATED_TO_CA, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<AuthorityManagePermissionDTO> getRegulatorUserPermissionsByCaAndId(
            @Parameter(hidden = true) AppUser pmrvUser,
            @PathVariable("userId") @Parameter(description = "The regulator user id") String userId) {
        return new ResponseEntity<>(regulatorAuthorityQueryService.getRegulatorUserPermissionsByUserId(pmrvUser, userId),
                HttpStatus.OK);
    }


    @GetMapping(path = "/group-levels")
    @Operation(summary = "Retrieves the regulator permissions group levels")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AuthorityManagePermissionDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>>> getRegulatorPermissionGroupLevels() {
        return new ResponseEntity<>(RegulatorPermissionsAdapter.getPermissionGroupLevels(), HttpStatus.OK);
    }
}
