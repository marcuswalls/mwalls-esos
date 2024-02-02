package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.verifier;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessCheckedException;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.SiteContactRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.UserRoleRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

@Service
@AllArgsConstructor
public class VerifierRequestTaskAssignmentService implements UserRoleRequestTaskAssignmentService {

    private final RequestTaskAssignmentService requestTaskAssignmentService;

    private final SiteContactRequestTaskAssignmentService siteContactRequestTaskAssignmentService;

    @Override
    public RoleType getRoleType() {
        return RoleType.VERIFIER;
    }

    @Transactional
    public void assignTask(RequestTask requestTask, String userId) {
        try {
            requestTaskAssignmentService.assignToUser(requestTask, userId);
        } catch (BusinessCheckedException e) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_NOT_ALLOWED);
        }
    }

    public void assignTasksOfDeletedVerifierToVbSiteContactOrRelease(String userDeleted) {
        siteContactRequestTaskAssignmentService
            .assignTasksOfDeletedUserToSiteContactOrRelease(userDeleted, AccountContactType.VB_SITE);
    }

}
