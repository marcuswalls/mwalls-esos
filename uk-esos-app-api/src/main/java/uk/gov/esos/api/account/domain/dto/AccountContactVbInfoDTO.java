package uk.gov.esos.api.account.domain.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

@Getter
@EqualsAndHashCode
public class AccountContactVbInfoDTO {

    private Long accountId;

    private String accountName;

    private String type;

    private String userId;

    public AccountContactVbInfoDTO(Long accountId, String accountName, EmissionTradingScheme type, String userId) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.type = type.getDescription();
        this.userId = userId;
    }
}
