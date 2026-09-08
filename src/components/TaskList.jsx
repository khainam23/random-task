import TaskItem from './TaskItem';

export default function TaskList({ tasks, onDelete, onEdit }) {
  return (
    <div className="glass p-6">
      <h2 className="text-sm font-bold tracking-wide text-white/68 flex items-center gap-2 mb-4">
        <span>📋</span> Tasks in your jar
        {tasks.length > 0 && (
          <span className="ml-auto text-xs font-bold text-blue-300 bg-blue-500/12 border border-blue-400/20 rounded-full px-2.5 py-0.5">
            {tasks.length}
          </span>
        )}
      </h2>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="text-4xl opacity-30 animate-float">🫙</span>
          <p className="text-white/32 text-sm">Your jar is empty.</p>
          <span className="text-white/18 text-xs">Add some tasks above to get started.</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}
