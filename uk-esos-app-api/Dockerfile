FROM eclipse-temurin:17-jdk
RUN apt-get update
RUN apt-get install -y openssh-client
# Do not change the order of the following two commands
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
RUN apt-get install -y --no-install-recommends fontconfig ttf-mscorefonts-installer
COPY src/main/resources/symbol.ttf /usr/share/fonts
RUN fc-cache -f -v

# Add custom CA certificate to Java trust store (done at runtime via entrypoint)
# Certificate will be mounted at /tmp/dockerhost-root-ca.crt and imported by entrypoint script

# Copy application and entrypoint script
COPY target/uk-esos-app-api.jar /opt/applications/uk-esos-app-api/uk-esos-app-api.jar
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Create user and set permissions
RUN groupadd -g 499 esos && useradd -m -r -u 499 -g esos esos
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN apt-get update && apt-get install -y sudo && rm -rf /var/lib/apt/lists/*
RUN echo "esos ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER esos
WORKDIR /opt/applications/uk-esos-app-api/

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["java", "-XX:+PrintFlagsFinal", "-Xmx1024m", "-Xms512m", "-jar", "uk-esos-app-api.jar"]
