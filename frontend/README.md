# ToDo Frontend (React)

A React + Vite web app for the ToDo API in [`../backend`](../backend).

## Run it

Start the backend first (it listens on port 3000):

```bash
cd backend && npm install && npm run dev
```

Then, in a second terminal:

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173.

In development, Vite forwards every `/api/*` request to the backend, so the
browser sees one origin and CORS never comes into play. The Docker setup below
runs the app cross-origin instead. If the backend runs somewhere else, set `BACKEND_URL` in
`frontend/.env` (see `.env.example`).

## Features

- Add tasks, with optional notes
- Mark tasks done or not done
- Edit a task's title and notes (✎ button, or double-click the task; Esc cancels)
- Delete tasks and clear all completed ones
- Filter by All / Active / Completed, with counts
- Shows which storage the backend uses (JSON or MySQL)
- Error banner with Retry if the backend is unreachable or rejects a request
- Light and dark mode follow the system setting

## How it calls the backend

All requests go through `src/api.js`:

| UI action | Request |
|---|---|
| Load the list | `GET /api/todos` |
| Show storage type | `GET /api/health` |
| Add a task | `POST /api/todos` |
| Tick / untick | `PATCH /api/todos/:id` with `{ completed }` |
| Save an edit | `PUT /api/todos/:id` |
| Delete / clear completed | `DELETE /api/todos/:id` |

## Running with Docker (cross-origin, real CORS)

The frontend image serves the built app with nginx on port 8080. The browser
then calls the backend **directly** at `API_URL`, a different origin, so every
request is a real cross-origin request. The backend has to allow the
frontend's origin through `CORS_ORIGIN`, as it would in production.

```bash
docker build -t todo-backend ./backend
docker build -t todo-frontend ./frontend
```

```bash
docker run -d --name todo-api -p 3000:3000 -v todo-data:/app/data \
  -e CORS_ORIGIN=http://localhost:8080 todo-backend
```

```bash
docker run -d --name todo-web -p 8080:8080 \
  -e API_URL=http://localhost:3000 todo-frontend
```

Open http://localhost:8080.

- **`API_URL`** is the backend address as seen from the user's **browser**, not
  from inside the container. It's read when the container starts and written to
  `/config.js`, so the same image works with any backend without rebuilding.
- **`CORS_ORIGIN`** on the backend must contain the frontend's exact origin
  (scheme, host and port). Several origins can be comma-separated, e.g.
  `http://localhost:5173,http://localhost:8080`.

To see CORS reject a request, start the backend with an origin that doesn't
match, such as `-e CORS_ORIGIN=http://localhost:5173`. The app shows a
"Cannot reach the API" banner. The browser console shows the real reason:
*blocked by CORS policy: No 'Access-Control-Allow-Origin' header*.

## Production build without Docker

```bash
npm run build
```

This writes static files to `dist/`. Set the backend address in
`dist/config.js`, or serve `dist/` from a server that forwards `/api` to the
backend and leave `API_URL` empty.
