FROM maven:3.9-eclipse-temurin-21 AS builder
LABEL authors="WojciechKorbel"
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN mvn clean install -DskipTests
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]