import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    const ok = await onAdd({ title: title.trim(), description: description.trim() || null });
    setSubmitting(false);
    if (ok) {
      setTitle('');
      setDescription('');
      setShowDetails(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="row">
        <input
          type="text"
          placeholder="What needs to be done?"
          aria-label="New task title"
          value={title}
          maxLength={255}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="primary" disabled={!title.trim() || submitting}>
          Add
        </button>
      </div>
      {showDetails ? (
        <textarea
          placeholder="Notes (optional)"
          aria-label="New task notes"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <button type="button" className="link" onClick={() => setShowDetails(true)}>
          + Add notes
        </button>
      )}
    </form>
  );
}
