package uk.gov.esos.api.common.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.validation.CountryCode;

import jakarta.validation.constraints.Size;

/**
 * The phone number details DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhoneNumberDTO {

    /** The country code phone. */
    @CountryCode(message = "{phoneNumber.countryCode.typeMismatch}")
    private String countryCode;

    /** The phone number. */
    @Size(max = 255, message = "{phoneNumber.number.typeMismatch}")
    private String number;
}
