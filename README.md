# Parking+ 🚗🅿️

**Parking+** is a professional management system designed for parking operators and clients. It provides a real-time overview of parking occupancy, automated billing based on dynamic tariffs, and a seamless client experience through secure QR-code check-ins.

---

## 🌟 Key Features

### For Operators
* **Live Occupancy Dashboard:** Real-time grid view of 50 numbered parking spaces.
* **Advanced Analytics:** Popularity charts showing peak usage times and slot demand.
* **Smart History:** Full access to vehicle parking logs, including simulated photo documentation for security.
* **Dynamic Tariffs:** Admin panel to manage hourly rates and time-based pricing intervals.

### For Clients
* **Self-Service Entry:** Instant QR-code generation containing plate number, entry time, and a dynamic link.
* **Real-Time Fee Tracker:** Access a live link via QR to check current parking fees before checkout.
* **Secure Payments:** Integration with user account balances for automated fund deduction.
* **Personal History:** View past parking sessions and payment receipts.

---

## 🛠 Tech Stack & Architecture

Parking+ is built as a modular monolith — a single deployable application internally divided into clearly separated business modules.

#The backend follows a layered architecture consisting of:#

* **Controllers** – REST API endpoints

* **Services** – business logic and application workflows

* **Repositories** – database access layer

* **Entities / Domain Models** – core data structures

* **DTOs / Mappers** – API communication layer

This structure ensures maintainability, testability, and makes it possible to extract modules into independent services if the system evolves.

###Backend###

The backend is implemented in **Kotlin** using **Spring Boot**, providing a robust and scalable REST API.

**Core technologies**

* **Kotlin**

* **Spring Boot**

* **Spring Data JPA / Hibernate**

* **Spring Security + JWT**

* **Flyway** – database migrations

* **PostgreSQL**

* **OpenAPI / Swagger**

* **JUnit + Testcontainers**


The application is organized into domain-based modules:

* **Users & Authentication**

* **Vehicles**

* **Parking Spaces**

* **Parking Sessions**

* **Payments**

* **Tariffs**

* **Photos**

* **Reports**

Each module encapsulates its own logic while remaining part of the same deployable application.

###Frontend###

The frontend is built with **Vue 3** using the **Nuxt** framework, enabling a modern, responsive user interface.

**Technologies**

* **Vue 3**

* **Nuxt**

* **TypeScript**

* **Pinia** – state management

* **Tailwind CSS**

The interface is divided into three main areas:

* **Operator Dashboard** – parking space monitoring and management

* **Customer Panel** – vehicle management and parking history

* **Public Payment View** – QR-based parking payment interface

###Database###

The system uses **PostgreSQ**L as the primary relational database.

Database schema changes are managed through **Flyway** migrations, ensuring consistent versioning and reproducible environments across development and deployment.

**Infrastructure**

The project is fully containerized using **Docker** to ensure consistent environments.

Local development is orchestrated with **Docker Compose**, which runs:

* **Backend service**

* **Frontend application**

* **PostgreSQL database**

This setup simplifies onboarding and guarantees consistent development environments across machines.

This ensures consistent environments and simplifies setup for contributors.
---

## ⚙️ Professional Workflow

This project follows the **Gitflow** branching model to ensure stability and code quality.

* **Branching:** All features happen in `feature/*` and merge into `develop`. Production releases are tagged on `main`.
* **Code Quality:** Every Pull Request requires a review.
* **Documentation:** Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.
