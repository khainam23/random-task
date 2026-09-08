import { useState } from 'react';

export default function TaskItem({ task, onDelete, onEdit }) {
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({ description: task.description, date: task.date || '', time: task.time || '' });
  const [err, setErr]           = useState('');
  const [deleting, setDeleting] = useState(false);

  function saveEdit() {
    if (!form.description.trim()) { setErr('Description cannot be empty.'); return; }
    onEdit(task.id, form);
    setEditing(false); setErr('');
  }

  function handleDelete() {
    setDeleting(true);
    setTimeout(() => onDelete(task.id), 320);
  }

  return (
    <li className={`flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-[12px] overflow-hidden transition-all
      ${deleting  ? 'animate-delete-out'  : 'animate-slide-in'}
      ${editing   ? 'border-blue-500/38 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]' : 'hover:bg-white/[0.055] hover:border-white/[0.12]'}`}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span className="text-sm text-white/80 break-words leading-relaxed">{task.description}</span>
          {(task.date || task.time) && (
            <div className="flex gap-1.5 flex-wrap">
              {task.date && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-300 bg-blue-500/10 border border-blue-400/18 rounded-full px-2.5 py-0.5">
                  📅 {task.date}
                </span>
              )}
              {task.time && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-300 bg-blue-500/10 border border-blue-400/18 rounded-full px-2.5 py-0.5">
                  ⏰ {task.time}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <button
            onClick={() => { setEditing(e => !e); setErr(''); setForm({ description: task.description, date: task.date||'', time: task.time||'' }); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs transition-all cursor-pointer
              ${editing
                ? 'bg-blue-500/20 border-blue-400/42 text-blue-300'
                : 'bg-transparent border-white/[0.08] text-white/28 hover:text-blue-300 hover:border-blue-400/35 hover:bg-blue-500/10'}`}
            title="Edit"
          >✎</button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg border text-xs transition-all cursor-pointer
              bg-transparent border-white/[0.08] text-white/28 hover:text-red-400 hover:border-red-400/35 hover:bg-red-400/[0.08]"
            title="Delete"
          >✕</button>
        </div>
      </div>

      {/* Inline edit panel */}
      {editing && (
        <div className="animate-expand-down border-t border-blue-500/15 bg-blue-500/[0.03] px-4 py-3 flex flex-col gap-2">
          <textarea
            rows={2}
            value={form.description}
            onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setErr(''); }}
            className="field-input resize-none"
            placeholder="Task description..."
          />
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <div className="flex gap-2">
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="field-input flex-1" />
            <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="field-input flex-1" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveEdit}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer transition-all
                bg-blue-500/20 border border-blue-400/35 text-blue-300 hover:bg-blue-500/35">
              Save
            </button>
            <button onClick={() => { setEditing(false); setErr(''); }}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer transition-all
                bg-transparent border border-white/10 text-white/30 hover:text-white/55">
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
