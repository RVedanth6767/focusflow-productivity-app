import { FocusTimer } from './components/FocusTimer/FocusTimer.js';
import { TaskList } from './components/TaskList/TaskList.js';
import { ProductivityDashboard } from './components/Dashboard/ProductivityDashboard.js';
import { TimerService } from './services/timerService.js';
import { TaskService } from './services/taskService.js';
import { SessionTracker } from './utils/sessionTracker.js';
import { DistractionService } from './services/distractionService.js';

const taskService = new TaskService();
const sessionTracker = new SessionTracker();
const distractionService = new DistractionService();
const timerService = new TimerService({});

const dashboard = new ProductivityDashboard(document.getElementById('dashboard-root'), {
  sessionTracker,
  taskService,
});

const focusTimer = new FocusTimer(document.getElementById('focus-timer-root'), {
  timerService,
  sessionTracker,
  distractionService,
  onDataChange: () => dashboard.render(),
});

focusTimer.attachLifecycleListeners();

const taskList = new TaskList(document.getElementById('task-list-root'), {
  taskService,
  getCurrentSessionId: () => focusTimer.getCurrentSessionId(),
});

const renderAll = () => {
  focusTimer.render();
  taskList.render();
  dashboard.render();
};

renderAll();
