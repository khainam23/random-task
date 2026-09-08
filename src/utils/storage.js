const KEY = 'random-task-jar';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}
