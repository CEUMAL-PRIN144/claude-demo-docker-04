import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [busy, setBusy] = useState(false);

  function startEdit() {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const ok = await onSave({ title: title.trim(), description: description.trim() || null });
    setBusy(false);
    if (ok) setEditing(false);
  }

  async function handle(action) {
    setBusy(true);
    await action();
    setBusy(false);
  }

  if (editing) {
    return (
      <li className="todo editing">
        <form onSubmit={handleSave} onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}>
          <input
            type="text"
            aria-label="Edit task title"
            value={title}
            maxLength={255}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            aria-label="Edit task notes"
            placeholder="Notes (optional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="actions">
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={!title.trim() || busy}>
              Save
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo ${todo.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        disabled={busy}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
        onChange={() => handle(onToggle)}
      />
      <div className="body" onDoubleClick={startEdit}>
        <span className="title">{todo.title}</span>
        {todo.description && <p className="description">{todo.description}</p>}
      </div>
      <div className="actions">
        <button className="icon" aria-label={`Edit "${todo.title}"`} onClick={startEdit} disabled={busy}>
          ✎
        </button>
        <button
          className="icon danger"
          aria-label={`Delete "${todo.title}"`}
          onClick={() => handle(onDelete)}
          disabled={busy}
        >
          ×
        </button>
      </div>
    </li>
  );
}
