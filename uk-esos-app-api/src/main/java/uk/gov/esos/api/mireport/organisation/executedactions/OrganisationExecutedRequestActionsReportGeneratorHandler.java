package uk.gov.esos.api.mireport.organisation.executedactions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestAction;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsReportGenerator;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;

import jakarta.persistence.EntityManager;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganisationExecutedRequestActionsReportGeneratorHandler
    extends ExecutedRequestActionsReportGenerator
    implements OrganisationMiReportGeneratorHandler<ExecutedRequestActionsMiReportParams> {

    private final OrganisationExecutedRequestActionsRepository executedRequestActionsRepository;

    @Override
    public List<ExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager,
                                                                  ExecutedRequestActionsMiReportParams reportParams) {
        return executedRequestActionsRepository.findExecutedRequestActions(entityManager, reportParams);
    }
}