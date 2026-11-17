# ToDo App

| Folder | What it is |
|---|---|
| [`backend/`](backend) | Express.js REST API; stores todos in a JSON file or MySQL |
| [`frontend/`](frontend) | React (Vite) web app, served by nginx in Docker |

## Run everything with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3000 (health check at `/api/health`)

Todos are kept in the `todo-data` volume, so they survive `docker compose down`.
To wipe them too, run `docker compose down -v`.

The browser calls the API directly on port 3000, so these are real cross-origin
requests. Compose sets the backend's `CORS_ORIGIN` to the frontend's origin and
the frontend's `API_URL` to the backend's address. The frontend container starts
only once the backend passes its health check.

### Other ports

Set `FRONTEND_PORT` and/or `BACKEND_PORT`, in your shell or in a `.env` file
next to `docker-compose.yml`:

```env
FRONTEND_PORT=9000
BACKEND_PORT=4000
```

`CORS_ORIGIN` and `API_URL` follow automatically.

## Run without Docker

See [`backend/README.md`](backend/README.md) and
[`frontend/README.md`](frontend/README.md).
