package uk.gov.esos.api.common.domain.converter;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel;
import uk.gov.esos.api.authorization.regulator.transform.RegulatorPermissionsAdapter;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_CA_USERS_EDIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_TASK_ASSIGNMENT;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.ASSIGN_REASSIGN_TASKS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_USERS_AND_CONTACTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.REVIEW_ORGANISATION_ACCOUNT;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.EXECUTE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.NONE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.VIEW_ONLY;

class RegulatorPermissionsAdapterTest {

    @Test
    void getPermissionsFromPermissionGroupLevels_one_permission_per_group_level() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels =
            Map.of(REVIEW_ORGANISATION_ACCOUNT, VIEW_ONLY,
                MANAGE_USERS_AND_CONTACTS, NONE,
                ASSIGN_REASSIGN_TASKS, EXECUTE);

        List<Permission> expectedPermissions = List.of(
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_TASK_ASSIGNMENT);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionsFromPermissionGroupLevels_multiple_permissions_per_group_level() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels =
            Map.of(REVIEW_ORGANISATION_ACCOUNT, EXECUTE,
                MANAGE_USERS_AND_CONTACTS, NONE,
                ASSIGN_REASSIGN_TASKS, EXECUTE);

        List<Permission> expectedPermissions = List.of(
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
        		PERM_TASK_ASSIGNMENT);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionsFromPermissionGroupLevels_multiple_permissions() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels = Map.ofEntries(
                Map.entry(REVIEW_ORGANISATION_ACCOUNT, EXECUTE),
                Map.entry(MANAGE_USERS_AND_CONTACTS, EXECUTE),
                Map.entry(ASSIGN_REASSIGN_TASKS, EXECUTE));

        List<Permission> expectedPermissions = List.of(
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                PERM_CA_USERS_EDIT,
                PERM_TASK_ASSIGNMENT);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions_one_permission_per_group_level() {
        List<Permission> permissions = List.of(
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_TASK_ASSIGNMENT);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, VIEW_ONLY);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, NONE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions_multiple_permissions_per_group_level() {
        List<Permission> permissions = List.of(
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
            PERM_TASK_ASSIGNMENT);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, NONE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions() {
        List<Permission> permissions = List.of(
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                PERM_CA_USERS_EDIT,
                PERM_TASK_ASSIGNMENT);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, EXECUTE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevels() {
        Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, List.of(NONE, VIEW_ONLY, EXECUTE));
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, List.of(NONE, EXECUTE));
        
        Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>> actualPermissionGroupLevels =
            RegulatorPermissionsAdapter.getPermissionGroupLevels();

        assertThat(actualPermissionGroupLevels.keySet())
            .containsExactlyInAnyOrderElementsOf(expectedPermissionGroupLevels.keySet());
        actualPermissionGroupLevels.forEach((group, levels) ->
            assertThat(levels).containsExactlyElementsOf(expectedPermissionGroupLevels.get(group)));
    }
}
