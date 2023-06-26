FROM eclipse-temurin:19 AS build

RUN mkdir /opt/src 
COPY . /opt/src
WORKDIR /opt/src
RUN ./gradlew clean build

FROM eclipse-temurin:19
VOLUME /tmp
RUN mkdir /app

COPY --from=build /opt/src/build/libs/japp*.jar /tmp/
RUN ls /tmp/*.jar | grep -v plain | xargs -I '{}' mv {} /app/japp.jar

ENTRYPOINT ["java","-jar","/app/japp.jar"]