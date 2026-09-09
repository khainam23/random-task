import { useEffect, useState } from 'react';

const STATUS_STYLE = {
  planned:     { label: 'Planned',     cls: 'text-white/40 bg-white/[0.06] border-white/10' },
  'in-progress': { label: 'In Progress', cls: 'text-blue-300 bg-blue-500/15 border-blue-400/30' },
  done:        { label: 'Done',        cls: 'text-green-300 bg-green-500/15 border-green-400/30' },
};

export default function Roadmap() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/roadmap.json')
      .then(r => r.json())
      .then(setItems)
      .catch(() => setError(true));
  }, []);

  if (error || items.length === 0) return null;

  return (
    <section className="glass p-6">
      <h2 className="text-sm font-bold tracking-wide text-white/70 flex items-center gap-2 mb-1">
        <span>🗺️</span> Roadmap
      </h2>
      <p className="text-xs text-white/28 mb-5">
        Các tính năng mong muốn làm
      </p>

      <ul className="flex flex-col gap-3">
        {items.map((item, i) => {
          const s = STATUS_STYLE[item.status] ?? STATUS_STYLE.planned;
          return (
            <li
              key={item.id ?? i}
              className="flex items-start gap-3 bg-white/[0.025] border border-white/[0.06] rounded-[10px] px-4 py-3"
            >
              <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white/82">{item.title}</span>
                  <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-xs text-white/38 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
