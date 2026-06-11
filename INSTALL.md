# Parking+ — instrukcja instalacji

Ten dokument opisuje uruchomienie aplikacji Parking+ w dwóch wariantach:

1. przez Docker Compose — zalecany sposób uruchomienia całego systemu,
2. lokalnie — osobno dla backendu i frontendu.

---

## 1. Wymagania

### 1.1. Uruchomienie przez Docker Compose

Wymagane są:

- Git,
- Docker,
- Docker Compose.

### 1.2. Uruchomienie lokalne

Wymagane są dodatkowo:

- Java Development Kit (JDK) 21,
- Node.js 20.x lub nowszy,
- npm,
- PostgreSQL 16.

---

## 2. Szybki start — Docker Compose

### 2.1. Klonowanie repozytorium

```bash
git clone https://github.com/Marc311o/parking-plus-web-app.git
cd parking-plus-web-app
```

### 2.2. Utworzenie pliku `.env`

W katalogu głównym projektu skopiuj plik `.env.example` jako `.env`.

Linux / macOS / Git Bash:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Przykładowa zawartość pliku `.env.example`:

```env
# PostgreSQL
POSTGRES_USER=parking_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=parking_db

# Optional e-mail configuration
# Leave empty if e-mail sending is not configured locally.
MAIL_USERNAME=
MAIL_PASSWORD=

# Frontend configuration
VITE_API_URL=http://localhost:8080/api
```

Po skopiowaniu pliku ustaw własne hasło bazy danych w lokalnym pliku `.env`:

```env
POSTGRES_PASSWORD=twoje_lokalne_haslo
```

Plik `.env` zawiera prywatne dane konfiguracyjne i nie powinien być dodawany do repozytorium.

Sprawdź, czy `.gitignore` zawiera wpis:

```gitignore
.env
```

### 2.3. Opcjonalna konfiguracja e-mail

Wysyłka wiadomości e-mail nie jest wymagana do podstawowego uruchomienia aplikacji.

Jeżeli chcesz korzystać z funkcji zależnych od poczty, ustaw w `.env`:

```env
MAIL_USERNAME=twoj_email@example.com
MAIL_PASSWORD="haslo aplikacyjne"
```

### 2.4. Uruchomienie aplikacji

```bash
docker compose up --build
```

Uruchomienie w tle:

```bash
docker compose up --build -d
```

Docker Compose uruchamia trzy usługi:

| Usługa | Opis | Adres lub port |
|---|---|---|
| `db` | PostgreSQL 16 | `localhost:5433` |
| `backend` | REST API Spring Boot | `http://localhost:8080/api` |
| `frontend` | aplikacja React/Vite | `http://localhost:5173` |

Backend uruchamia się po przejściu kontroli gotowości bazy danych.

---

## 3. Konfiguracja środowiska Docker

### 3.1. PostgreSQL

Dane dostępowe do PostgreSQL są przekazywane z pliku `.env`:

```yaml
POSTGRES_USER: ${POSTGRES_USER}
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
POSTGRES_DB: ${POSTGRES_DB}
```

Domyślny port bazy danych dostępny z komputera lokalnego:

```text
localhost:5433
```

Port `5433` na hoście jest mapowany na port `5432` wewnątrz kontenera.

### 3.2. Backend

Backend łączy się z bazą danych przez nazwę usługi `db`:

```text
jdbc:postgresql://db:5432/${POSTGRES_DB}
```

Konfiguracja przekazywana do kontenera backendu:

```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${POSTGRES_DB}
SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
MAIL_USERNAME: ${MAIL_USERNAME:-}
MAIL_PASSWORD: ${MAIL_PASSWORD:-}
```

### 3.3. Frontend

Adres backendu jest przekazywany do frontendu przez zmienną:

```env
VITE_API_URL=http://localhost:8080/api
```

Przy uruchomieniu przez Docker Compose nie trzeba ustawiać go ręcznie poza plikiem `.env`.

---

## 4. Adresy po uruchomieniu

| Element | Adres |
|---|---|
| Frontend | `http://localhost:5173` |
| REST API | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| PostgreSQL | `localhost:5433` |

Przy pierwszym uruchomieniu aplikacja automatycznie inicjalizuje strukturę bazy danych i tworzy testowe konta użytkowników, w tym konto operatora, oraz przykładową mapę parkingu.

---

## 5. Przydatne polecenia Docker Compose

Podgląd uruchomionych usług:

```bash
docker compose ps
```

Podgląd logów wszystkich usług:

```bash
docker compose logs -f
```

Podgląd logów backendu:

```bash
docker compose logs -f backend
```

Zatrzymanie kontenerów:

```bash
docker compose down
```

Zatrzymanie kontenerów i usunięcie danych zapisanych w wolumenach:

```bash
docker compose down -v
```

> Polecenie `docker compose down -v` usuwa lokalne dane bazy. Używaj go tylko wtedy, gdy chcesz zresetować środowisko.

---

## 6. Lokalna konfiguracja deweloperska

### 6.1. Backend

Przejdź do katalogu backendu:

```bash
cd backend
```

Skopiuj przykładową konfigurację lokalną:

Linux / macOS / Git Bash:

```bash
cp src/main/resources/application-local.properties.example \
   src/main/resources/application-local.properties
```

Windows PowerShell:

```powershell
Copy-Item src/main/resources/application-local.properties.example `
  src/main/resources/application-local.properties
```

Uzupełnij dane dostępowe do lokalnej instancji PostgreSQL.

Uruchom backend z profilem `local`.

Linux / macOS:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Windows:

```powershell
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Po poprawnym uruchomieniu backend będzie dostępny pod adresem:

```text
http://localhost:8080/api
```

### 6.2. Frontend

Przejdź do katalogu frontendu:

```bash
cd frontend
```

Zainstaluj zależności:

```bash
npm install
```

Uruchom serwer Vite:

```bash
npm run dev
```

Frontend będzie dostępny pod adresem:

```text
http://localhost:5173
```

Przy uruchomieniu frontendu poza Dockerem upewnij się, że korzysta on z poprawnego adresu backendu:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 7. Rozwiązywanie problemów

### 7.1. Backend nie uruchamia się

Sprawdź logi backendu:

```bash
docker compose logs -f backend
```

Sprawdź stan usług:

```bash
docker compose ps
```

### 7.2. Port jest już zajęty

Sprawdź, czy inne procesy nie korzystają z portów:

- `5173` — frontend,
- `8080` — backend,
- `5433` — PostgreSQL.

Zatrzymaj proces używający portu albo zmień mapowanie portu w `docker-compose.yml`.

### 7.3. Potrzebny jest reset lokalnej bazy danych

```bash
docker compose down -v
docker compose up --build
```

Po ponownym uruchomieniu aplikacja utworzy dane testowe od początku.

### 7.4. Funkcje e-mail nie działają

Sprawdź, czy w `.env` ustawiono poprawne dane:

```env
MAIL_USERNAME=twoj_email@example.com
MAIL_PASSWORD="haslo aplikacyjne"
```

Jeżeli konfiguracja poczty pozostaje pusta, podstawowe funkcje aplikacji nadal powinny działać, ale funkcje zależne od wysyłki wiadomości e-mail będą niedostępne.
