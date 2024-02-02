package uk.gov.esos.api.workflow.request.flow.common.service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;

public interface RequestCreateValidator {

    RequestCreateActionType getType();
}
