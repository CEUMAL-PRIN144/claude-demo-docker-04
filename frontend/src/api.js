// Thin client for the Express ToDo API.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // A proxy in front of a stopped backend answers 502-504 with no JSON body.
    if (!data && [502, 503, 504].includes(res.status)) {
      throw new Error('Cannot reach the server. Is the backend running?');
    }
    const details = data?.details?.length ? `: ${data.details.join(', ')}` : '';
    throw new Error((data?.error || `Request failed (${res.status})`) + details);
  }
  return data;
}

export const api = {
  health: () => request('/health'),
  listTodos: () => request('/todos'),
  createTodo: (todo) => request('/todos', { method: 'POST', body: todo }),
  replaceTodo: (id, todo) => request(`/todos/${id}`, { method: 'PUT', body: todo }),
  updateTodo: (id, changes) => request(`/todos/${id}`, { method: 'PATCH', body: changes }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
