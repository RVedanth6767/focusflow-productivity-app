export class ProductivityDashboard {
  constructor(root, { sessionTracker, taskService }) {
    this.root = root;
    this.sessionTracker = sessionTracker;
    this.taskService = taskService;
  }

  render() {
    const analytics = this.sessionTracker.getAnalytics();
    const tasks = this.taskService.getTasks();

    const completedTasks = tasks.filter((task) => task.completed).length;
    const openTasks = tasks.length - completedTasks;

    this.root.innerHTML = '';
    const panel = document.createElement('section');
    panel.className = 'panel';

    const heading = document.createElement('h2');
    heading.textContent = 'Productivity Dashboard';

    const stats = document.createElement('div');
    stats.className = 'dashboard-stats';

    const cards = [
      ['Completed Focus Sessions', analytics.completedSessions],
      ['Daily Focus Time (min)', analytics.dailyFocusTime],
      ['Weekly Focus Time (min)', analytics.weeklyFocusTime],
      ['Completed Tasks', completedTasks],
      ['Open Tasks', openTasks],
    ];

    cards.forEach(([label, value]) => {
      const card = document.createElement('article');
      card.className = 'stat-card';

      const valueEl = document.createElement('strong');
      valueEl.textContent = String(value);

      const labelEl = document.createElement('span');
      labelEl.textContent = label;

      card.append(valueEl, labelEl);
      stats.append(card);
    });

    panel.append(heading, stats);
    this.root.append(panel);
  }
}
