import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import TodoForm from './components/TodoForm.jsx';
import TodoItem from './components/TodoItem.jsx';

const FILTERS = {
  all: () => true,
  active: (t) => !t.completed,
  completed: (t) => t.completed,
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [list, health] = await Promise.all([api.listTodos(), api.health()]);
      setTodos(list);
      setDataSource(health.dataSource);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Run an API call, surfacing any error in the banner. Returns true on success.
  async function run(action) {
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  const replaceInList = (updated) =>
    setTodos((list) => list.map((t) => (t.id === updated.id ? updated : t)));

  const addTodo = (data) =>
    run(async () => {
      const created = await api.createTodo(data);
      setTodos((list) => [...list, created]);
    });

  const toggleTodo = (todo) =>
    run(async () => replaceInList(await api.updateTodo(todo.id, { completed: !todo.completed })));

  const saveTodo = (todo, { title, description }) =>
    run(async () =>
      replaceInList(await api.replaceTodo(todo.id, { title, description, completed: todo.completed }))
    );

  const deleteTodo = (todo) =>
    run(async () => {
      await api.deleteTodo(todo.id);
      setTodos((list) => list.filter((t) => t.id !== todo.id));
    });

  const clearCompleted = () =>
    run(async () => {
      const done = todos.filter((t) => t.completed);
      const results = await Promise.allSettled(done.map((t) => api.deleteTodo(t.id)));
      const deleted = new Set(done.filter((_, i) => results[i].status === 'fulfilled').map((t) => t.id));
      setTodos((list) => list.filter((t) => !deleted.has(t.id)));
      if (deleted.size < done.length) throw new Error('Some todos could not be deleted');
    });

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter(FILTERS.active).length,
      completed: todos.filter(FILTERS.completed).length,
    }),
    [todos]
  );
  const visible = todos.filter(FILTERS[filter]);

  return (
    <main className="app">
      <header className="app-header">
        <h1>ToDo</h1>
        <p className="subtitle">
          {counts.active} {counts.active === 1 ? 'task' : 'tasks'} left
        </p>
      </header>

      <TodoForm onAdd={addTodo} />

      {error && (
        <div className="error" role="alert">
          <span>{error}</span>
          <button className="link" onClick={loading ? undefined : load}>
            Retry
          </button>
          <button className="icon" aria-label="Dismiss error" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <nav className="filters" aria-label="Filter todos">
        {Object.keys(FILTERS).map((key) => (
          <button
            key={key}
            className={filter === key ? 'active' : ''}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key[0].toUpperCase() + key.slice(1)} <span className="count">{counts[key]}</span>
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="empty">
          {filter === 'all' ? 'Nothing to do yet. Add your first task above.' : `No ${filter} tasks.`}
        </p>
      ) : (
        <ul className="todo-list">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo)}
              onSave={(data) => saveTodo(todo, data)}
              onDelete={() => deleteTodo(todo)}
            />
          ))}
        </ul>
      )}

      <footer className="app-footer">
        {counts.completed > 0 && (
          <button className="link" onClick={clearCompleted}>
            Clear completed ({counts.completed})
          </button>
        )}
        {dataSource && <span className="source">Storage: {dataSource}</span>}
      </footer>
    </main>
  );
}
