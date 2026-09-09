import { useState, useRef } from 'react';
import Background from './components/Background';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import RandomResult from './components/RandomResult';
import { useTasks } from './hooks/useTasks';
import Roadmap from './components/Roadmap';
import Donate from './components/Donate';

const REMOVE_KEY = 'random-task-jar-remove-after';
function loadRemove() {
  try { return localStorage.getItem(REMOVE_KEY) === 'true'; } catch { return false; }
}

export default function App() {
  const { tasks, addTask, editTask, deleteTask, randomTask } = useTasks();
  const [result, setResult]           = useState(null);
  const [shaking, setShaking]         = useState(false);
  const [removeAfter, setRemoveAfter] = useState(loadRemove);
  const [jarBounce, setJarBounce]     = useState(false);
  const jarRef = useRef(null);

  function toggleRemoveAfter() {
    setRemoveAfter(prev => {
      const next = !prev;
      localStorage.setItem(REMOVE_KEY, String(next));
      return next;
    });
  }

  function handleAdd(taskData) {
    addTask(taskData);
    // Bounce jar ~580ms after particle is spawned (particle duration = 600ms)
    setTimeout(() => {
      setJarBounce(true);
      setTimeout(() => setJarBounce(false), 600);
    }, 560);
  }

  function handleRandom() {
    if (shaking) return;
    setShaking(true);
    setTimeout(() => { setShaking(false); setResult(randomTask() ?? 'empty'); }, 700);
  }

  function handleClose(pickedId) {
    if (removeAfter && pickedId) deleteTask(pickedId);
    setResult(null);
  }

  const jarAnim = shaking ? 'animate-shake' : jarBounce ? 'animate-jar-bounce' : '';

  return (
    <>
      <Background />

      <div className="relative z-10 max-w-[640px] mx-auto px-5 pb-20">

        {/* ── Hero ── */}
        <header className="text-center flex flex-col items-center pt-16 pb-10">

          <span className="text-[10px] font-bold tracking-[2px] uppercase mb-5
            text-blue-400 bg-blue-500/10 border border-blue-400/22 rounded-full px-3.5 py-1">
            Personal Productivity
          </span>

          <h1 className="text-gradient text-5xl font-extrabold tracking-tight leading-tight mb-3">
            🫙 Random Task Jar
          </h1>
          <p className="text-white/35 text-base leading-relaxed mb-10">
            Drop your tasks in the jar.<br />Let fate decide what you do next.
          </p>

          {/* ── Jar ── */}
          <div
            className={`relative mb-7 ${tasks.length > 0 ? 'cursor-pointer' : 'pointer-events-none'}`}
            onClick={tasks.length > 0 ? handleRandom : undefined}
          >
            {/* glow */}
            <div className="animate-pulse-glow absolute inset-[-28px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.28) 0%, transparent 70%)' }} />

            {/* jar — jarRef here so particle lands accurately */}
            <div
              ref={jarRef}
              className={`flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.03] ${jarAnim}`}
              style={{ filter: 'drop-shadow(0 8px 36px rgba(59,130,246,0.42))' }}
            >
              {/* lid */}
              <div className="w-16 h-2.5 rounded-t-lg mb-0.5"
                style={{ background: 'linear-gradient(90deg, var(--c-accent-dk), var(--c-accent-lt), var(--c-accent))' }} />
              {/* body */}
              <div className="w-36 flex flex-col items-center gap-2 py-5 px-4 rounded-b-[20px] border border-blue-300/18"
                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.055),rgba(59,130,246,0.07))', backdropFilter: 'blur(10px)' }}>
                <span className="text-5xl leading-none animate-float">🫙</span>
                <span className="text-xs text-white/38">
                  {tasks.length === 0
                    ? <em className="text-white/20">Empty</em>
                    : <><strong className="text-blue-400">{tasks.length}</strong> task{tasks.length > 1 ? 's' : ''} inside</>
                  }
                </span>
              </div>
            </div>
          </div>

          {/* ── Random button ── */}
          <button
            onClick={handleRandom}
            disabled={tasks.length === 0 || shaking}
            className={`relative inline-flex items-center gap-2.5 text-white font-bold text-base px-9 py-4 rounded-[14px]
              border-0 cursor-pointer transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0
              hover:-translate-y-0.5
              before:content-[''] before:absolute before:inset-0 before:rounded-[14px] before:bg-gradient-to-r before:from-white/15 before:to-transparent
              ${shaking ? 'animate-btn-glow' : ''}`}
            style={{
              background: 'linear-gradient(135deg, var(--c-accent-dk), var(--c-accent))',
              boxShadow: `0 4px 24px var(--c-accent-glow), inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            <span className="text-xl">🎲</span>
            {shaking ? 'Shaking...' : 'Random Task'}
          </button>

          {/* ── Toggle: remove after random ── */}
          <button
            onClick={toggleRemoveAfter}
            title="Khi bật: task được chọn sẽ bị xóa khỏi hũ sau khi nhấn Got it!"
            className={`mt-4 inline-flex items-center gap-2.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer
              ${removeAfter
                ? 'bg-blue-500/15 border-blue-400/42 text-blue-300'
                : 'bg-white/[0.04] border-white/10 text-white/28 hover:text-white/48 hover:border-white/18'}`}
          >
            <span className={`relative inline-block w-7 h-4 rounded-full transition-colors duration-200
              ${removeAfter ? 'bg-blue-500' : 'bg-white/15'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200
                ${removeAfter ? 'left-3.5' : 'left-0.5'}`} />
            </span>
            Remove task after picking
          </button>
        </header>

        {/* ── Content ── */}
        <main className="flex flex-col gap-5">
          <TaskForm onAdd={handleAdd} jarRef={jarRef} />
          <TaskList tasks={tasks} onDelete={deleteTask} onEdit={editTask} />
          <Roadmap />
          <Donate />
        </main>

        <footer className="text-center text-white/18 text-xs mt-10 pt-6 border-t border-white/[0.05]">
          Made with <a href="https://github.com/khainam23" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">khainam23</a> — shake the jar, trust the jar.
        </footer>
      </div>

      <RandomResult
        result={result}
        removeAfter={removeAfter}
        onPickAnother={() => setResult(randomTask() ?? 'empty')}
        onClose={handleClose}
      />
    </>
  );
}
