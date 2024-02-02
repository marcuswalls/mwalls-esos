package uk.gov.esos.api.account.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Objects;

@Data
@Builder
public class AccountSearchResults<T> {

    private List<T> accounts;
    private Long total;

    public AccountSearchResults(List<T> accounts, long total) {
        this.accounts = Objects.requireNonNull(accounts);
        this.total = total;
    }
}
