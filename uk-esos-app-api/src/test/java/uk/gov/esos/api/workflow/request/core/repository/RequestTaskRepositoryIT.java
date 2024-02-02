package uk.gov.esos.api.workflow.request.core.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.ORGANISATION_ACCOUNT_OPENING;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.NOTIFICATION_OF_COMPLIANCE_P3;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class RequestTaskRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private RequestTaskRepository repository;
    
    @Autowired
	private EntityManager entityManager;
    
    @Test
    void findByRequestTypeAndAssignee() {
    	final String assignee = "assignee";
		final String anotherAsignee = "another_assignee";
    	Request requestInstallationAccountOpening = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
    	RequestTask requestTaskInstallationAccountOpeningAssignee = createRequestTask(requestInstallationAccountOpening, assignee, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    	
    	Request requestInstallationAccountOpeningAnotherAssignee = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
        // requestTaskInstallationAccountOpeningAnotherAssignee
    	createRequestTask(requestInstallationAccountOpeningAnotherAssignee, anotherAsignee, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    	
    	Request requestPermitIssuance = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
    	// requestTaskPermitIssuanceAssignee
    	createRequestTask(requestPermitIssuance, assignee, RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);
    	
    	flushAndClear();
    	
    	//invoke
    	List<RequestTask> tasksFound = repository.findByRequestTypeAndAssignee(RequestType.ORGANISATION_ACCOUNT_OPENING, assignee);
    	
    	//assert
    	assertThat(tasksFound).hasSize(1);
    	assertThat(tasksFound.get(0).getId()).isEqualTo(requestTaskInstallationAccountOpeningAssignee.getId());
    }

	@Test
	void findByRequestTypeAndAssigneeAndRequestAccountId() {
		final String assignee = "assignee";
		final RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
		final Long accountId = 1L;

		Request request1 = createRequest(RequestStatus.IN_PROGRESS, accountId, CompetentAuthorityEnum.ENGLAND, requestType);
		RequestTask requestTask1 = createRequestTask(request1, assignee, ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		Request request2 = createRequest(RequestStatus.IN_PROGRESS, accountId, CompetentAuthorityEnum.ENGLAND, NOTIFICATION_OF_COMPLIANCE_P3);
		createRequestTask(request2, assignee, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);

		Request request3 = createRequest(RequestStatus.IN_PROGRESS, 2L, CompetentAuthorityEnum.ENGLAND, requestType);
		createRequestTask(request3, assignee, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);

		Request request4 = createRequest(RequestStatus.IN_PROGRESS, 1L, CompetentAuthorityEnum.ENGLAND, requestType);
		createRequestTask(request4, "other_assignee", NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);
		
		flushAndClear();

		//invoke
		List<RequestTask> tasksFound = repository.findByRequestTypeAndAssigneeAndRequestAccountId(requestType, assignee, accountId);

		//assert
		assertThat(tasksFound).hasSize(1);
		assertThat(tasksFound.get(0).getId()).isEqualTo(requestTask1.getId());
	}
	
	@Test
    void findByAssigneeAndRequestStatus() {
        final String assignee = "assignee";
		final String anotherAsignee = "another_assignee";

        Request requestOpen1 = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, ORGANISATION_ACCOUNT_OPENING);
        RequestTask requestTaskOpen1 = createRequestTask(requestOpen1, assignee, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        
        Request requestClosed = createRequest(RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND, ORGANISATION_ACCOUNT_OPENING);
        // requestTaskForClosedRequest
        createRequestTask(requestClosed, assignee, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		Request requestOpen2 = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
		createRequestTask(requestOpen2, anotherAsignee, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		flushAndClear();
        
        //invoke
        List<RequestTask> tasksFound = repository.findByAssigneeAndRequestStatus(assignee, RequestStatus.IN_PROGRESS);
        
        //assert
        assertThat(tasksFound).hasSize(1);
        assertThat(tasksFound.get(0).getId()).isEqualTo(requestTaskOpen1.getId());
    }

    @Test
    void findByAssigneeAndRequestAccountIdAndRequestStatus() {
        String assignee1 = "assignee1";
		String assignee2 = "assignee2";

		Long accountId1 = 1L;
		Long accountId2 = 2L;

        Request request1 = createRequest(RequestStatus.IN_PROGRESS, accountId1, CompetentAuthorityEnum.ENGLAND, ORGANISATION_ACCOUNT_OPENING);
        RequestTask request1Task1 = createRequestTask(request1, assignee1, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		Request request2 = createRequest(RequestStatus.IN_PROGRESS, accountId1, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
		createRequestTask(request2, assignee2, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		Request request3 = createRequest(RequestStatus.COMPLETED, accountId1, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
		createRequestTask(request3, assignee1, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		Request request4 = createRequest(RequestStatus.IN_PROGRESS, accountId2, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
		createRequestTask(request4, assignee1, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

		flushAndClear();

		List<RequestTask> requestTasksFound =
            repository.findByAssigneeAndRequestAccountIdAndRequestStatus(assignee1, accountId1, RequestStatus.IN_PROGRESS);

        assertThat(requestTasksFound).containsOnly(request1Task1);
    }

    @Test
    void findByRequestId() {
        String user1 = "user1";
        String user2 = "user2";

        Request request1 = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
        RequestTask request1Task1 = createRequestTask(request1, user1, ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        RequestTask request1Task2 = createRequestTask(request1, user2, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);

        Request request2 = createRequest(RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING);
        createRequestTask(request2, user1, ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

        flushAndClear();

        List<RequestTask> requestTasksFound = repository.findByRequestId(request1.getId());

        assertThat(requestTasksFound).containsExactly(request1Task1, request1Task2);
    }
    
    private Request createRequest(
    		RequestStatus status,
    		CompetentAuthorityEnum ca,
    		RequestType type) {
        return createRequest(status, null, ca, type);
    }

	private Request createRequest(
		RequestStatus status,
		Long accountId,
		CompetentAuthorityEnum ca,
		RequestType type) {
		Request request =
			Request.builder()
				.id(RandomStringUtils.random(5))
				.type(type)
				.status(status)
				.competentAuthority(ca)
				.accountId(accountId)
				.build();
		entityManager.persist(request);
		return request;
	}
	
	private RequestTask createRequestTask(
    		Request request, 
    		String assignee, 
    		RequestTaskType type) {
    	RequestTask requestTask = 
    			RequestTask.builder()
    				.request(request)
    				.assignee(assignee)
    				.processTaskId(String.valueOf(UUID.randomUUID()))
    				.type(type)
    				.startDate(LocalDateTime.now())
    				.build();
    	entityManager.persist(requestTask);
        return requestTask;
    }
    
    private void flushAndClear() {
		entityManager.flush();
		entityManager.clear();
	}

}