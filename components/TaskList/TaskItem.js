export class TaskItem {
  constructor(task, { onToggle, onAssociate }) {
    this.task = task;
    this.onToggle = onToggle;
    this.onAssociate = onAssociate;
  }

  render() {
    const item = document.createElement('li');
    item.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.task.completed;
    checkbox.addEventListener('change', () => this.onToggle(this.task.id));

    const title = document.createElement('span');
    title.textContent = this.task.title;
    title.className = this.task.completed ? 'task-title done' : 'task-title';

    const priority = document.createElement('span');
    priority.textContent = this.task.priority;
    priority.className = `priority-pill priority-${this.task.priority.toLowerCase()}`;

    const associateBtn = document.createElement('button');
    associateBtn.textContent = 'Link to Current Focus';
    associateBtn.type = 'button';
    associateBtn.addEventListener('click', () => this.onAssociate(this.task.id));

    item.append(checkbox, title, priority, associateBtn);
    return item;
  }
}
