package uk.gov.esos.api.user.core.domain.model.core;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AppUserTest {

    @Test
    void getAccounts() {
        Long accountId = 1L;
        AppUser pmrvUser = createOperatorUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(accountId).build()
        );
        pmrvUser.setAuthorities(authorities);

        Set<Long> accounts = pmrvUser.getAccounts();

        assertThat(accounts).containsOnly(accountId);
    }

    @Test
    void getAccounts_no_authorities() {
        AppUser pmrvUser = createOperatorUser("user");

        Set<Long> accounts = pmrvUser.getAccounts();

        assertThat(accounts).isEmpty();
    }

    @Test
    void getAccounts_no_account_authorities() {
        AppUser pmrvUser = createRegulatorUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()
        );
        pmrvUser.setAuthorities(authorities);

        Set<Long> accounts = pmrvUser.getAccounts();

        assertThat(accounts).isEmpty();
    }

    @Test
    void getVerificationBodyId() {
        Long vbId = 1L;
        AppUser pmrvUser = createVerifierUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().verificationBodyId(vbId).build()
        );
        pmrvUser.setAuthorities(authorities);

        Long optionalVbId = pmrvUser.getVerificationBodyId();

        assertThat(optionalVbId).isNotNull();
        assertEquals(vbId, optionalVbId);
    }

    @Test
    void getVerificationBodyId_no_authorities() {
        AppUser pmrvUser = createVerifierUser("user");

        Long optionalVbId = pmrvUser.getVerificationBodyId();

        assertThat(optionalVbId).isNull();
    }

    @Test
    void getVerificationBodyId_no__verifier_authorities() {
        AppUser pmrvUser = createVerifierUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()
        );
        pmrvUser.setAuthorities(authorities);

        Long optionalVbId = pmrvUser.getVerificationBodyId();

        assertThat(optionalVbId).isNull();
    }

    @Test
    void getCompetentAuthority() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        AppUser pmrvUser = createRegulatorUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().competentAuthority(competentAuthority).build()
        );
        pmrvUser.setAuthorities(authorities);

        CompetentAuthorityEnum optionalCompetentAuthority = pmrvUser.getCompetentAuthority();

        assertThat(optionalCompetentAuthority).isNotNull();
        assertEquals(competentAuthority, optionalCompetentAuthority);
    }

    @Test
    void getCompetentAuthority_no_authorities() {
        AppUser pmrvUser = createRegulatorUser("user");

        CompetentAuthorityEnum optionalCompetentAuthority = pmrvUser.getCompetentAuthority();

        assertThat(optionalCompetentAuthority).isNull();
    }

    @Test
    void getVerificationBodyId_no__regulator_authorities() {
        AppUser pmrvUser = createVerifierUser("user");
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(1L).build()
        );
        pmrvUser.setAuthorities(authorities);

        CompetentAuthorityEnum optionalCompetentAuthority = pmrvUser.getCompetentAuthority();

        assertThat(optionalCompetentAuthority).isNull();
    }

	private AppUser createRegulatorUser(String userId) {
    	return createUser(userId, RoleType.REGULATOR);
    }
	
	private AppUser createOperatorUser(String userId) {
    	return createUser(userId, RoleType.OPERATOR);
    }

    private AppUser createVerifierUser(String userId) {
        return createUser(userId, RoleType.VERIFIER);
    }
	
	private AppUser createUser(String userId, RoleType roleType) {
    	return AppUser.builder()
    				.userId(userId)
    				.email("email@email")
    				.firstName("fn")
    				.lastName("ln")
    				.roleType(roleType)
    				.build();
    }
	
}
