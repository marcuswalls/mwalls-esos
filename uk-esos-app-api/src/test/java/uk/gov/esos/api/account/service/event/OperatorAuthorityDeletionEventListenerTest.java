package uk.gov.esos.api.account.service.event;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountContactDeletionService;

@ExtendWith(MockitoExtension.class)
class OperatorAuthorityDeletionEventListenerTest {

    @InjectMocks
    private OperatorAuthorityDeletionEventListener operatorAuthorityDeletionEventListener;

    @Mock
    private AccountContactDeletionService accountContactDeletionService;

    @Test
    void onOperatorUserDeletionEventListener() {
        String userId = "userId";
        Long accountId = 1L;
        uk.gov.esos.api.authorization.operator.event.OperatorAuthorityDeletionEvent event = uk.gov.esos.api.authorization.operator.event.OperatorAuthorityDeletionEvent.builder()
            .accountId(accountId)
            .userId(userId)
            .build();

        operatorAuthorityDeletionEventListener.onOperatorUserDeletionEventListener(event);

        verify(accountContactDeletionService,times(1)).removeUserFromAccountContacts(userId, accountId);
    }
}