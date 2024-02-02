package uk.gov.esos.api.workflow.request.flow.common.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentValidationService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

@Service
@RequiredArgsConstructor
public class SupportingTaskAssignmentValidator {

    private final RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;

    public void validate(RequestTask requestTask, RequestTaskType requestTaskType, String selectedAssignee, AppUser appUser) {
        if (!requestTaskAssignmentValidationService
            .hasUserPermissionsToBeAssignedToTaskType(requestTask, requestTaskType, selectedAssignee, appUser)) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_NOT_ALLOWED);
        }
    }
}
