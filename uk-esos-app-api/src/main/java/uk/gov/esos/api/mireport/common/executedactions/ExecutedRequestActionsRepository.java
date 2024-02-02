package uk.gov.esos.api.mireport.common.executedactions;

import jakarta.persistence.EntityManager;
import java.util.List;

public interface ExecutedRequestActionsRepository {

    List<ExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager,
                                                           ExecutedRequestActionsMiReportParams reportParams);
}
