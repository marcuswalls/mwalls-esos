package uk.gov.esos.api.mireport.common.outstandingrequesttasks;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.common.PostgresJpqlTemplates;
import uk.gov.esos.api.workflow.request.core.domain.QRequest;
import uk.gov.esos.api.workflow.request.core.domain.QRequestTask;

import java.util.List;

@Repository
public class OutstandingRequestTasksRepository {

    @Transactional(readOnly = true)
    public List<OutstandingRequestTask> findOutstandingRequestTaskParams(EntityManager entityManager,
                                                                         OutstandingRegulatorRequestTasksMiReportParams params) {

        QRequest request = QRequest.request;
        QRequestTask requestTask = QRequestTask.requestTask;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;

        JPAQuery<OutstandingRequestTask> query = new JPAQuery<>(entityManager, PostgresJpqlTemplates.DEFAULT);

        JPAQuery<OutstandingRequestTask> jpaQuery = query.select(
                        Projections.constructor(
                                OutstandingRequestTask.class,
                                account.organisationId,
                                account.accountType,
                                account.name,
                                request.id,
                                request.type,
                                requestTask.type,
                                requestTask.assignee,
                                requestTask.dueDate,
                                requestTask.pauseDate)
                )
                .from(request)
                .innerJoin(requestTask).on(request.id.eq(requestTask.request.id))
                .innerJoin(account).on(request.accountId.eq(account.id));

        BooleanExpression wherePredicate = requestTask.type.in(params.getRequestTaskTypes());

        if (!params.getUserIds().isEmpty()) {
            wherePredicate = wherePredicate.and(requestTask.assignee.in(params.getUserIds()));
        }

        query.where(wherePredicate);
        query.orderBy(account.id.asc(), request.type.asc(), request.id.asc(), requestTask.type.asc());

        return jpaQuery.fetch();
    }
}
