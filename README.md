# Citra Invoice Backend

## Run with Docker

Copy the example environment file first:

```bash
cp .env.example .env
```

Start the API and MongoDB:

```bash
docker compose up --build
```

The API runs on:

```text
http://localhost:8000
```

MongoDB is exposed on:

```text
mongodb://localhost:27017
```

For Docker Compose, the app connects to MongoDB through the internal service URL:

```text
mongodb://mongo:27017
```

## Useful endpoints

Register an initial user:

```http
POST /register
```

```json
{
  "fullname": "Admin Local",
  "username": "admin",
  "password": "secret123",
  "role": "super_admin"
}
```

Login:

```http
POST /login
```
