import { TaskItem } from './TaskItem.js';

export class TaskList {
  constructor(root, { taskService, getCurrentSessionId }) {
    this.root = root;
    this.taskService = taskService;
    this.getCurrentSessionId = getCurrentSessionId;
  }

  render() {
    const tasks = this.taskService.getTasks();

    this.root.innerHTML = '';
    const panel = document.createElement('section');
    panel.className = 'panel';

    const title = document.createElement('h2');
    title.textContent = 'Task Management';

    const form = document.createElement('form');
    form.className = 'task-form';

    const input = document.createElement('input');
    input.placeholder = 'Add a task';
    input.required = true;

    const priority = document.createElement('select');
    ['High', 'Medium', 'Low'].forEach((level) => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = level;
      priority.append(option);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.textContent = 'Add Task';

    form.append(input, priority, addBtn);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.taskService.addTask({ title: input.value, priority: priority.value });
      form.reset();
      this.render();
    });

    const list = document.createElement('ul');
    list.className = 'task-list';

    tasks.forEach((task) => {
      const taskItem = new TaskItem(task, {
        onToggle: (taskId) => {
          this.taskService.toggleTaskComplete(taskId);
          this.render();
        },
        onAssociate: (taskId) => {
          const activeSessionId = this.getCurrentSessionId();
          if (!activeSessionId) {
            alert('Start a focus session first to associate tasks.');
            return;
          }
          this.taskService.associateTaskWithSession(taskId, activeSessionId);
          this.render();
        },
      });
      list.append(taskItem.render());
    });

    panel.append(title, form, list);
    this.root.append(panel);
  }
}
