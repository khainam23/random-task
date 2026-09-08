export default function RandomResult({ result, removeAfter, onPickAnother, onClose }) {
  if (!result) return null;

  if (result === 'empty') {
    return (
      <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-xl"
        onClick={() => onClose(null)}>
        <div className="glass max-w-sm w-full p-10 text-center flex flex-col items-center gap-4"
          onClick={e => e.stopPropagation()}>
          <span className="text-5xl opacity-35">🫙</span>
          <p className="text-white/52 font-semibold">The jar is empty.</p>
          <p className="text-white/28 text-sm">Add some tasks first.</p>
          <button onClick={() => onClose(null)}
            className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer transition-all
              bg-blue-500/15 border border-blue-400/28 text-blue-300 hover:bg-blue-500/28">
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/75 backdrop-blur-xl"
      onClick={() => onClose(null)}>
      <div
        className="animate-reveal glass max-w-[480px] w-full p-10 text-center flex flex-col items-center gap-5
          shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.07)]"
        onClick={e => e.stopPropagation()}
      >
        <span className="animate-sparkle text-5xl leading-none">✨</span>

        <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-400">Your task for now</p>

        <p className="text-2xl font-bold text-white/88 leading-snug tracking-tight">
          {result.description}
        </p>

        {(result.date || result.time) && (
          <div className="flex gap-2 flex-wrap justify-center">
            {result.date && (
              <span className="text-sm font-semibold text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5">
                📅 {result.date}
              </span>
            )}
            {result.time && (
              <span className="text-sm font-semibold text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5">
                ⏰ {result.time}
              </span>
            )}
          </div>
        )}

        {removeAfter && (
          <p className="text-xs text-white/20 -mt-1">
            This task will be removed from the jar after you confirm.
          </p>
        )}

        <div className="flex gap-3 flex-wrap justify-center mt-1">
          <button
            onClick={onPickAnother}
            className="text-white text-sm font-bold px-6 py-3 rounded-[10px] cursor-pointer transition-all
              hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--c-accent-dk), var(--c-accent))',
              boxShadow: '0 4px 20px var(--c-accent-glow)',
            }}
          >
            🎲 Pick Another
          </button>
          <button
            onClick={() => onClose(result.id)}
            className="bg-transparent border border-white/10 text-white/42 text-sm font-semibold px-6 py-3 rounded-[10px]
              hover:text-white/72 hover:border-white/20 transition-all cursor-pointer"
          >
            {removeAfter ? '✅ Done & Remove' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
}
