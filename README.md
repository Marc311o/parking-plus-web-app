# Parking+

Parking+ is a professional-grade parking management ecosystem designed to streamline operations for parking providers while offering a frictionless experience for end-users. The system integrates real-time occupancy tracking, automated dynamic billing, secure multi-factor authentication, and QR-based session management into a cohesive, high-performance platform.

---

## Table of Contents
1. [Key Features](#1-key-features)
2. [Installation Guide](#2-installation-guide)
    - [2.1 Quick Start (Docker Compose)](#21-quick-start-docker-compose)
    - [2.2 Local Development Setup](#22-local-development-setup)
3. [Technical Stack](#3-technical-stack)
4. [Project Architecture](#4-project-architecture)
    - [4.1 Modular Monolith Design](#41-modular-monolith-design)
    - [4.2 Backend Layered Architecture](#42-backend-layered-architecture)
    - [4.3 Frontend Architecture](#43-frontend-architecture)
5. [API Documentation](#5-api-documentation)
6. [Workflow and Contribution Standards](#6-workflow-and-contribution-standards)

---

## 1. Key Features

### Operator and Admin Capabilities
*   **Live Occupancy Dashboard:** A high-fidelity grid view of 50+ parking slots with real-time status updates (Available, Occupied, Reserved, Maintenance).
*   **Dynamic Tariff Engine:** Granular control over pricing strategies, allowing operators to set rates based on time of day, day of week, and vehicle type.
*   **Advanced Analytics and Reporting:** Visualized data insights using Chart.js, covering peak usage periods, revenue trends, and slot turnover rates.
*   **Security and Audit Logs:** Full historical audit trail of all parking sessions, including simulated vehicle photo documentation and entry/exit timestamps.
*   **User Management:** Administrative tools to manage operator roles, client accounts, and financial balances.

### Client Experience
*   **Seamless Entry/Exit:** Automated QR code generation upon entry, encoding license plate data and entry telemetry.
*   **Live Fee Calculator:** Real-time cost tracking accessible via a unique web link, allowing users to monitor their fees before checkout.
*   **Integrated Digital Wallet:** Secure balance management with automated payment deduction upon session completion.
*   **Multi-Factor Authentication (MFA):** Enhanced account security using TOTP-based (Google Authenticator) secondary verification.
*   **Vehicle Management:** Support for multiple vehicles per account with active/inactive status toggling.

---

## 2. Installation Guide

### 2.1 Quick Start (Docker Compose)
The entire ecosystem (Backend, Frontend, and Database) is containerized for consistent deployment.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Marc311o/parking-plus-web-app.git
   cd parking-plus-web-app
   ```
2. **Launch the platform:**
   ```bash
   docker compose up --build
   ```
3. **Access Services:**
    *   Frontend Application: `http://localhost:5173`
    *   REST API Base: `http://localhost:8080/api`
    *   Database (PostgreSQL): `localhost:5433`

### 2.2 Local Development Setup
For developers wishing to run services natively for debugging or profiling.

#### Prerequisites
*   Java 21 (JDK)
*   Node.js 20.x and npm
*   PostgreSQL 16

#### Backend Setup
1. Navigate to the `backend` directory.
2. Create `src/main/resources/application-local.properties` based on the provided `.example` file.
3. Configure your local database credentials.
4. Run via Maven:
   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 3. Technical Stack

### Backend Infrastructure
*   **Core:** Kotlin 2.0 with Spring Boot 3.2.
*   **Data Access:** Spring Data JPA with Hibernate as the ORM provider.
*   **Database:** PostgreSQL 16 for relational data persistence.
*   **Security:** Spring Security 6 with stateless JWT authentication.
*   **Utilities:** Jackson for JSON processing, JJWT for token management, and TOTP libraries for MFA.

### Frontend Engineering
*   **Core:** React 18 with TypeScript for robust type safety.
*   **Build Tool:** Vite for ultra-fast Hot Module Replacement (HMR).
*   **State Management:** Zustand for lightweight, scalable global state.
*   **Data Visualization:** Chart.js with React wrappers.
*   **Localization:** custom i18n implementation supporting English and Polish.

---

## 4. Project Architecture

### 4.1 Modular Monolith Design
Parking+ is architected as a **Modular Monolith**. While it is deployed as a single unit, the internal structure is strictly divided into domain-specific modules. This approach provides the simplicity of a monolith for deployment while offering the clear boundaries and reduced coupling typical of microservices.

Core Modules:
*   **Auth Module:** Handles identity, JWT generation, and MFA logic.
*   **User Module:** Manages profiles, balances, and roles.
*   **Parking Module:** Tracks slot status and occupancy logic.
*   **Session Module:** Manages the lifecycle of a parking stay (Check-in -> Active -> Check-out).
*   **Billing Module:** Calculates costs based on the Tariff engine and processes transactions.

### 4.2 Backend Layered Architecture
Each module follows a strict 4-layer pattern:
1.  **Web/Controller Layer:** REST endpoints defining the contract. Uses Spring MVC.
2.  **Service/Business Layer:** Contains all domain logic and cross-module orchestration. Annotated with `@Service`.
3.  **Persistence/Repository Layer:** Abstracted data access using the Repository pattern. Annotated with `@Repository`.
4.  **Domain/Entity Layer:** JPA Entities representing the database schema and core data structures.

### 4.3 Frontend Architecture
The React application is structured for scalability and reusability:
*   **Components:** Atomic UI elements categorized into Common and Feature-specific (e.g., Dashboard, Parking).
*   **Layouts:** High-level page wrappers for Auth and Main application areas.
*   **Store:** Centralized state using Zustand, separated by domain (Auth, Locale).
*   **API:** A dedicated layer using the Fetch API (or Axios) to abstract network calls and handle DTO mapping.

---

## 5. API Documentation

Comprehensive API documentation is automatically generated using SpringDoc (OpenAPI 3).

*   **Swagger UI:** Interactive documentation and sandbox.
    `http://localhost:8080/swagger-ui.html`
*   **OpenAPI Spec (JSON):** Machine-readable API definition.
    `http://localhost:8080/v3/api-docs`

---

## 6. Workflow and Contribution Standards

We maintain high code quality through rigorous standards and a structured workflow. For detailed instructions on how to contribute, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md).

### Key Standards:
*   **Gitflow Model:** All development occurs on `feature/*` branches. Merges to `develop` require a successful build and approval.
*   **Testing:** We follow a Test-Driven Development (TDD) approach where possible. Every new feature or bug fix must include corresponding unit or integration tests.
*   **Code Style:** All Kotlin code must adhere to the official [Kotlin Style Guide](https://kotlinlang.org/docs/coding-conventions.html).
*   **Documentation:** Every new API endpoint must be documented via Swagger annotations.
*   **Security First:** Never commit secrets, API keys, or environment-specific configuration to the repository. Use `.env` files or environment variables.

---

**TODO**
* add images and diagrams for architecture and workflow
* check installation instructions for accuracy