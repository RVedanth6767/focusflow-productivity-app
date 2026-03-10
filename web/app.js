/**
 * FocusFlow local task management UI.
 * Uses localStorage to persist tasks in browser.
 */

const STORAGE_KEY = 'focusflow_tasks';

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** TaskItem component renders one task and its actions. */
class TaskItem {
  constructor(task, onToggleComplete, onDelete, onLinkSession) {
    this.task = task;
    this.onToggleComplete = onToggleComplete;
    this.onDelete = onDelete;
    this.onLinkSession = onLinkSession;
  }

  render() {
    const row = document.createElement('div');
    row.className = `task-row ${this.task.completed ? 'completed' : ''}`;

    row.innerHTML = `
      <div>
        <strong>${this.task.title}</strong>
        <span class="badge ${this.task.priority}">${this.task.priority}</span>
        <div>${this.task.description || ''}</div>
        <small>Status: ${this.task.completed ? 'Completed' : 'Pending'}</small><br />
        <small>Linked Session: ${this.task.focusSessionId || 'Not linked'}</small>
      </div>
      <div class="actions">
        <button data-action="complete">${this.task.completed ? 'Undo' : 'Complete'}</button>
        <input data-action="session" placeholder="session id" value="${this.task.focusSessionId || ''}" />
        <button data-action="link">Link</button>
        <button data-action="delete">Delete</button>
      </div>
    `;

    row.querySelector('[data-action="complete"]').onclick = () => this.onToggleComplete(this.task.id);
    row.querySelector('[data-action="delete"]').onclick = () => this.onDelete(this.task.id);
    row.querySelector('[data-action="link"]').onclick = () => {
      const sessionId = row.querySelector('[data-action="session"]').value.trim();
      this.onLinkSession(this.task.id, sessionId);
    };

    return row;
  }
}

/** TaskList component owns state and persistence. */
class TaskList {
  constructor(container) {
    this.container = container;
    this.tasks = loadTasks();
    this.render();
  }

  addTask(task) {
    this.tasks.unshift(task);
    saveTasks(this.tasks);
    this.render();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    saveTasks(this.tasks);
    this.render();
  }

  toggleComplete(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(this.tasks);
    this.render();
  }

  linkSession(id, focusSessionId) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, focusSessionId: focusSessionId || null } : task
    );
    saveTasks(this.tasks);
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    if (!this.tasks.length) {
      this.container.textContent = 'No tasks yet.';
      return;
    }

    this.tasks.forEach((task) => {
      const item = new TaskItem(
        task,
        (id) => this.toggleComplete(id),
        (id) => this.deleteTask(id),
        (id, sessionId) => this.linkSession(id, sessionId)
      );
      this.container.appendChild(item.render());
    });
  }
}

const list = new TaskList(document.getElementById('task-list'));

document.getElementById('task-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const priority = document.getElementById('priority').value;

  if (!title) return;

  list.addTask({
    id: crypto.randomUUID(),
    title,
    description,
    priority,
    completed: false,
    focusSessionId: null,
  });

  event.target.reset();
  document.getElementById('priority').value = 'Medium';
});
