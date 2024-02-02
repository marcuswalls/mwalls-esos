package uk.gov.esos.api.account.organisation.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;

import static org.junit.jupiter.api.Assertions.*;

class OrganisationAccountAddressMapperTest {

    private static final OrganisationAccountMapper mapper = Mappers.getMapper(OrganisationAccountMapper.class);

    @Test
    void toAddressDTO() {
        CountyAddress source = CountyAddress.builder()
            .line1("line1")
            .line2("line2")
            .city("city")
            .county("county")
            .postcode("postcode")
            .build();

        CountyAddressDTO target = mapper.toCountyAddressDTO(source);

        assertEquals(source.getLine1(), target.getLine1());
        assertEquals(source.getLine2(), target.getLine2());
        assertEquals(source.getCity(), target.getCity());
        assertEquals(source.getPostcode(), target.getPostcode());
        assertEquals(source.getCounty(), target.getCounty());
    }
}