import { useState, useRef } from 'react';

export default function TaskForm({ onAdd, jarRef }) {
  const [desc, setDesc]   = useState('');
  const [date, setDate]   = useState('');
  const [time, setTime]   = useState('');
  const [err, setErr]     = useState('');
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  function spawnParticle() {
    if (!jarRef?.current || !btnRef?.current) return;
    const btnRect = btnRef.current.getBoundingClientRect();
    const jarRect = jarRef.current.getBoundingClientRect();
    const startX  = btnRect.left + btnRect.width  / 2;
    const startY  = btnRect.top  + btnRect.height / 2;
    const tx = jarRect.left + jarRect.width  / 2 - startX;
    const ty = jarRect.top  + jarRect.height / 2 - startY;

    const el = document.createElement('div');
    el.className   = 'fly-particle';
    el.textContent = '📝';
    el.style.left  = `${startX}px`;
    el.style.top   = `${startY}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc.trim()) { setErr('Please enter a task.'); return; }
    spawnParticle();
    onAdd({ description: desc, date, time });
    setDesc(''); setDate(''); setTime(''); setErr('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass p-6 flex flex-col gap-3 transition-all duration-300
        ${added ? 'shadow-[0_0_28px_rgba(59,130,246,0.18)] ring-1 ring-blue-400/40' : ''}`}
    >
      <h2 className="text-sm font-bold tracking-wide text-white/70 flex items-center gap-2 mb-1">
        <span>✏️</span> Add a task
      </h2>

      <div className="flex flex-col gap-1">
        <textarea
          rows={3}
          placeholder="What do you want to do?"
          value={desc}
          onChange={e => { setDesc(e.target.value); setErr(''); }}
          className={`field-input resize-none ${err ? 'error' : ''}`}
        />
        {err && <p className="text-red-400 text-xs pl-1">{err}</p>}
      </div>

      <div className="flex gap-2 sm:flex-row flex-col">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[11px] text-white/28 pl-1">Date (optional)</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="field-input" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[11px] text-white/28 pl-1">Time (optional)</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="field-input" />
        </div>
      </div>

      <button
        ref={btnRef}
        type="submit"
        className="self-start text-sm font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer transition-all hover:-translate-y-0.5
          bg-blue-500/18 hover:bg-blue-500/32 border border-blue-400/32 hover:border-blue-400/60 text-blue-300"
      >
        {added ? '✅ Added!' : '+ Add to Jar'}
      </button>
    </form>
  );
}
