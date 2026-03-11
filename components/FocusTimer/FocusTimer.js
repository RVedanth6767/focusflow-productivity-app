export class FocusTimer {
  constructor(root, { timerService, sessionTracker, distractionService, onDataChange }) {
    this.root = root;
    this.timerService = timerService;
    this.sessionTracker = sessionTracker;
    this.distractionService = distractionService;
    this.onDataChange = onDataChange;
    this.currentSessionId = null;
    this.lastCompletedSessionId = null;
  }

  getCurrentSessionId() {
    return this.currentSessionId;
  }

  getLastCompletedSessionId() {
    return this.lastCompletedSessionId;
  }

  render() {
    const state = this.timerService.getState();
    this.root.innerHTML = '';

    const panel = document.createElement('section');
    panel.className = 'panel';

    const heading = document.createElement('h2');
    heading.textContent = 'Pomodoro Focus Timer';

    const mode = document.createElement('p');
    mode.className = 'timer-mode';
    mode.textContent = `Mode: ${state.mode === 'focus' ? 'Focus' : 'Break'}`;

    const clock = document.createElement('div');
    clock.className = 'timer-clock';
    clock.textContent = this.formatTime(state.remainingSeconds);

    const controls = document.createElement('div');
    controls.className = 'control-row';

    const start = document.createElement('button');
    start.textContent = 'Start';
    start.type = 'button';
    start.addEventListener('click', () => {
      if (state.mode === 'focus' && !state.isRunning && !this.currentSessionId) {
        this.currentSessionId = crypto.randomUUID();
      }
      this.timerService.start();
      this.render();
    });

    const pause = document.createElement('button');
    pause.textContent = 'Pause';
    pause.type = 'button';
    pause.addEventListener('click', () => {
      this.timerService.pause();
      this.render();
    });

    const reset = document.createElement('button');
    reset.textContent = 'Reset';
    reset.type = 'button';
    reset.addEventListener('click', () => {
      this.currentSessionId = null;
      this.timerService.reset();
      this.render();
    });

    controls.append(start, pause, reset);

    const distractionBlock = this.renderDistractionBlock(state.isRunning && state.mode === 'focus');

    panel.append(heading, mode, clock, controls, distractionBlock);
    this.root.append(panel);
  }

  renderDistractionBlock(isFocusActive) {
    const wrapper = document.createElement('div');
    wrapper.className = 'distraction-block';

    const title = document.createElement('h3');
    title.textContent = 'Distraction Blocking';

    const form = document.createElement('form');
    form.className = 'inline-form';

    const siteInput = document.createElement('input');
    siteInput.placeholder = 'Add distracting URL (e.g. youtube.com)';

    const addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.textContent = 'Add';

    form.append(siteInput, addBtn);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.distractionService.addSite(siteInput.value);
      form.reset();
      this.render();
    });

    const sites = this.distractionService.getSites();
    const list = document.createElement('ul');
    list.className = 'plain-list';
    sites.forEach((site) => {
      const item = document.createElement('li');
      item.textContent = site;
      list.append(item);
    });

    const testForm = document.createElement('form');
    testForm.className = 'inline-form';
    const testInput = document.createElement('input');
    testInput.placeholder = 'Test a URL';
    const checkButton = document.createElement('button');
    checkButton.type = 'submit';
    checkButton.textContent = 'Check';
    testForm.append(testInput, checkButton);

    const status = document.createElement('p');
    status.className = 'status-text';
    testForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = this.distractionService.attemptVisit(testInput.value, isFocusActive);
      status.textContent = result.message;
      status.className = result.allowed ? 'status-text ok' : 'status-text warn';
    });

    wrapper.append(title, form, list, testForm, status);
    return wrapper;
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  attachLifecycleListeners() {
    this.timerService.onTick = () => this.render();
    this.timerService.onModeChange = () => this.render();
    this.timerService.onSessionComplete = (mode) => {
      if (mode === 'focus') {
        const session = this.sessionTracker.addCompletedFocusSession(25, this.currentSessionId ? [this.currentSessionId] : []);
        this.lastCompletedSessionId = session.id;
        this.currentSessionId = null;
        this.onDataChange?.();
      }
    };
  }
}
