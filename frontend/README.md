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

In development, Vite forwards every `/api/*` request to the backend, so there's
no CORS setup. If the backend runs somewhere else, set `BACKEND_URL` in
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

## Production build

```bash
npm run build
```

This writes static files to `dist/`. Serve them from any web server that also
forwards `/api` to the backend. Or set `VITE_API_URL` at build time to call the
backend directly; the backend already allows cross-origin requests.
