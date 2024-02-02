package uk.gov.esos.api.user.operator.service;

import java.util.Set;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.core.domain.enumeration.UserInvitationStatus;

public interface OperatorRoleCodeAcceptInvitationService {

    UserInvitationStatus acceptInvitation(OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation);

    Set<String> getRoleCodes();
}
