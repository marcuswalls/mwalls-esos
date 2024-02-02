package uk.gov.esos.api.workflow.request.application.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.gov.esos.api.workflow.request.application.item.domain.RequestTaskVisit;

@Repository
public interface RequestTaskVisitRepository extends JpaRepository<RequestTaskVisit, Long> {

    void deleteByTaskId(Long taskId);
}
