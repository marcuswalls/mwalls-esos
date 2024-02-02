package gov.uk.esos.keycloak.user.api.provider;

import java.util.Collections;
import java.util.List;

import gov.uk.esos.keycloak.user.api.model.jpa.UserDetails;
import org.keycloak.connections.jpa.entityprovider.JpaEntityProvider;

public class UserDetailsJpaEntityProvider implements JpaEntityProvider {

    @Override
    public List<Class<?>> getEntities() {
        return Collections.singletonList(UserDetails.class);
    }

    @Override
    public String getChangelogLocation() {
        return "META-INF/liquibase/userdetails-changelog_v_0_1_0.xml";
    }

    @Override
    public String getFactoryId() {
        return UserDetailsJpaEntityProviderFactory.ID;
    }
    
    @Override
    public void close() {
    }

}
