package uk.gov.esos.api.user.operator.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.user.core.domain.dto.validation.Password;

import jakarta.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
public class OperatorUserRegistrationWithCredentialsDTO extends OperatorUserRegistrationDTO {

    @NotBlank(message = "{userAccount.password.notEmpty}")
    @Password(message = "{userAccount.password.typeMismatch}")
    private String password;
}
