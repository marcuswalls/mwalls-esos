package uk.gov.esos.api.authorization.rules.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NonUniqueResultException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRule;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class AuthorizationRuleCustomRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private AuthorizationRuleCustomRepositoryImpl repo;
    
    @Autowired
    private EntityManager entityManager;
    
    @Test
    void findResourceSubTypesRoleTypes() {
        createRule(ResourceType.REQUEST_TASK, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name(), "handler1", Scope.REQUEST_TASK_EXECUTE, RoleType.REGULATOR);
        createRule(ResourceType.REQUEST_TASK, RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT.name(), "handler2", Scope.REQUEST_TASK_EXECUTE, RoleType.OPERATOR);
        createRule(ResourceType.REQUEST_ACTION, "sub", "handler3", Scope.REQUEST_TASK_EXECUTE, RoleType.OPERATOR);
        createRule(ResourceType.REQUEST_ACTION, "sub", "handler3", Scope.REQUEST_TASK_EXECUTE, RoleType.REGULATOR);
        
        Map<String, Set<RoleType>> result = repo.findResourceSubTypesRoleTypes();
        
        assertThat(result)
            .containsExactlyInAnyOrderEntriesOf(Map.of(
                    RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name(), Set.of(RoleType.REGULATOR),
                    RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT.name(), Set.of(RoleType.OPERATOR),
                    "sub", Set.of(RoleType.OPERATOR, RoleType.REGULATOR)
                    ));
    }
    
    @Test
    void findRoleTypeByResourceTypeAndSubType() {
        ResourceType resourceType = ResourceType.REQUEST_TASK;
        String resourceSubType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name();
        createRule(resourceType, resourceSubType, "handler1", Scope.REQUEST_TASK_EXECUTE, RoleType.REGULATOR);
        
        createRule(resourceType, resourceSubType, "handler2", Scope.REQUEST_TASK_VIEW, RoleType.REGULATOR);
        
        Optional<RoleType> ruleOpt = repo.findRoleTypeByResourceTypeAndSubType(resourceType, resourceSubType);
        
        assertThat(ruleOpt)
                .isNotEmpty()
                .contains(RoleType.REGULATOR);
    }
    
    @Test
    void findRoleTypeByResourceTypeAndSubType_not_found() {
        ResourceType resourceType = ResourceType.REQUEST_TASK;
        String resourceSubType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name();
        
        createRule(resourceType, resourceSubType, "handler1", Scope.REQUEST_TASK_EXECUTE, RoleType.REGULATOR);
        
        Optional<RoleType> ruleOpt = repo.findRoleTypeByResourceTypeAndSubType(resourceType, "invalid");
        
        assertThat(ruleOpt).isEmpty();
    }
    
    @Test
    void findRoleTypeByResourceTypeAndSubType_multiple_role_types_found() {
        ResourceType resourceType = ResourceType.REQUEST_TASK;
        String resourceSubType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name();
        
        createRule(resourceType, resourceSubType, "handler1", Scope.REQUEST_TASK_EXECUTE, RoleType.REGULATOR);
        createRule(resourceType, resourceSubType, "handler2", Scope.REQUEST_TASK_VIEW, RoleType.OPERATOR);
        
        assertThrows(NonUniqueResultException.class, () ->
                repo.findRoleTypeByResourceTypeAndSubType(resourceType, resourceSubType));
    }
    
    private void createRule(ResourceType resourceType, String resourceSubType, String handler, Scope scope, RoleType roleType) {
        AuthorizationRule rule = AuthorizationRule.builder()
                .resourceType(resourceType)
                .resourceSubType(resourceSubType)
                .handler(handler)
                .scope(scope)
                .roleType(roleType)
                .build();
        entityManager.persist(rule);
    }
}
