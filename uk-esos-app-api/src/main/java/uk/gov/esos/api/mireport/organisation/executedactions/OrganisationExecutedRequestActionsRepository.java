package uk.gov.esos.api.mireport.organisation.executedactions;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestAction;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsRepository;
import uk.gov.esos.api.workflow.request.core.domain.QRequest;
import uk.gov.esos.api.workflow.request.core.domain.QRequestAction;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public class OrganisationExecutedRequestActionsRepository implements ExecutedRequestActionsRepository {

    public List<ExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager, ExecutedRequestActionsMiReportParams reportParams) {
        QRequest request = QRequest.request;
        QRequestAction requestAction = QRequestAction.requestAction;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;

        JPAQuery<ExecutedRequestAction> query = new JPAQuery<>(entityManager);

        BooleanBuilder isCreationDateBeforeToDate = new BooleanBuilder();
        if(reportParams.getToDate() != null){
            isCreationDateBeforeToDate.and(requestAction.creationDate.before(LocalDateTime.of(reportParams.getToDate(), LocalTime.MIDNIGHT)));
        }

        JPAQuery<ExecutedRequestAction> jpaQuery = query.select(
            Projections.constructor(ExecutedRequestAction.class,
                account.organisationId, account.accountType, account.name, account.status.stringValue(),
                request.id, request.type, request.status,
                requestAction.type, requestAction.submitter, requestAction.creationDate))
            .from(request)
            .innerJoin(requestAction).on(request.id.eq(requestAction.request.id))
            .innerJoin(account).on(request.accountId.eq(account.id))
            .where(requestAction.creationDate.goe(LocalDateTime.of(reportParams.getFromDate(), LocalTime.MIDNIGHT))
                    .and(isCreationDateBeforeToDate))
            .orderBy(account.id.asc(),request.type.asc(), request.id.asc(), requestAction.creationDate.asc());

        return jpaQuery.fetch();
    }
}