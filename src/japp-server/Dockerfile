FROM --platform=linux/amd64 eclipse-temurin:19

VOLUME /tmp
COPY build/libs/*.jar japp.jar

ENTRYPOINT ["java","-jar","/japp.jar"]