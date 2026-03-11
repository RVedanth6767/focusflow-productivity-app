const TASK_STORAGE_KEY = 'focusflow.tasks';

const readTasks = () => {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
};

/**
 * TaskService centralizes all task persistence and update logic.
 * Keeping this in one place makes future API migration easier.
 */
export class TaskService {
  getTasks() {
    return readTasks();
  }

  addTask({ title, priority }) {
    const tasks = readTasks();
    const task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      sessionIds: [],
    };

    tasks.unshift(task);
    saveTasks(tasks);
    return task;
  }

  toggleTaskComplete(taskId) {
    const tasks = readTasks().map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    saveTasks(tasks);
    return tasks;
  }

  associateTaskWithSession(taskId, sessionId) {
    const tasks = readTasks().map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const nextIds = task.sessionIds.includes(sessionId)
        ? task.sessionIds
        : [...task.sessionIds, sessionId];

      return { ...task, sessionIds: nextIds };
    });

    saveTasks(tasks);
    return tasks;
  }
}
