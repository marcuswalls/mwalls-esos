FROM eclipse-temurin:17-jdk
RUN apt-get update
RUN apt-get install -y openssh-client
# Do not change the order of the following two commands
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
RUN apt-get install -y --no-install-recommends fontconfig ttf-mscorefonts-installer
COPY src/main/resources/symbol.ttf /usr/share/fonts
RUN fc-cache -f -v
COPY target/uk-esos-app-api.jar /opt/applications/uk-esos-app-api/uk-esos-app-api.jar
RUN groupadd -g 499 esos && useradd -m -r -u 499 -g esos esos
USER esos
WORKDIR /opt/applications/uk-esos-app-api/
CMD ["/bin/bash", "-c", "java -XX:+PrintFlagsFinal -Xmx1024m -Xms512m -jar uk-esos-app-api.jar"]
