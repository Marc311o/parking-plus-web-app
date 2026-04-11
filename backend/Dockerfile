FROM maven:3.9-eclipse-temurin-17 AS builder
LABEL authors="WojciechKorbel"
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]