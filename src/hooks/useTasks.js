import { useState, useEffect } from 'react';
import { loadTasks, saveTasks } from '../utils/storage';

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks());

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  function addTask({ description, date, time }) {
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      description: description.trim(),
      date: date || null,
      time: time || null,
      createdAt: new Date().toISOString(),
    }]);
  }

  function editTask(id, { description, date, time }) {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, description: description.trim(), date: date || null, time: time || null }
        : t
    ));
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function randomTask() {
    if (tasks.length === 0) return null;
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  return { tasks, addTask, editTask, deleteTask, randomTask };
}
