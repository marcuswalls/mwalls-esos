package uk.gov.esos.api.mireport.organisation.accountsregulatorsitecontacts;

import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsRepository;

import jakarta.persistence.EntityManager;
import java.util.List;

@Repository
public class OrganisationAccountAssignedRegulatorSiteContactsRepository implements AccountAssignedRegulatorSiteContactsRepository {

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<AccountAssignedRegulatorSiteContact> findAccountAssignedRegulatorSiteContacts(EntityManager entityManager) {

        return entityManager.createNativeQuery("select acc_org.organisation_id as \"accountId\", account.type as \"accountType\", " +
                " account.name as \"accountName\", acc_org.status as \"accountStatus\", " +
                " auth.status as \"authorityStatus\", acc_contact.user_id as \"userId\" " +
                " from account " +
                " inner join account_organisation acc_org on account.id = acc_org.id " +
                " left join account_contact acc_contact on account.id = acc_contact.account_id and acc_contact.contact_type='CA_SITE' " +
                " left join au_authority auth on acc_contact.user_id = auth.user_id " +
                        " order by acc_contact.user_id, acc_org.status, account.name asc")
                .unwrap(NativeQuery.class)
                .addScalar("accountId", StandardBasicTypes.STRING)
                .addScalar("accountType", StandardBasicTypes.STRING)
                .addScalar("accountName", StandardBasicTypes.STRING)
                .addScalar("accountStatus", StandardBasicTypes.STRING)
                .addScalar("authorityStatus", StandardBasicTypes.STRING)
                .addScalar("userId", StandardBasicTypes.STRING)
                .setReadOnly(true)
                .setTupleTransformer(Transformers.aliasToBean(AccountAssignedRegulatorSiteContact.class))
                .getResultList();
    }
}
