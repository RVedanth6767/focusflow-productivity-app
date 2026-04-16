const STORAGE_KEY = 'flowmind-workspace-state-v2';
const DEFAULT_BASE_URL = 'http://localhost:4000';

const elements = {
  taskForm: document.getElementById('task-form'),
  taskTitleInput: document.getElementById('task-title-input'),
  taskDescriptionInput: document.getElementById('task-description-input'),
  taskPriorityInput: document.getElementById('task-priority-input'),
  taskAssigneeInput: document.getElementById('task-assignee-input'),
  taskTabs: document.getElementById('task-tabs'),
  taskCountBadge: document.getElementById('task-count-badge'),
  focusedTotal: document.getElementById('focused-total'),
  switchCount: document.getElementById('switch-count'),
  workspaceEmpty: document.getElementById('workspace-empty'),
  workspaceContent: document.getElementById('workspace-content'),
  workspaceTaskTitle: document.getElementById('workspace-task-title'),
  workspaceTaskDescription: document.getElementById('workspace-task-description'),
  workspaceMiniTime: document.getElementById('workspace-mini-time'),
  workspaceTimer: document.getElementById('workspace-timer'),
  workspacePriority: document.getElementById('workspace-priority'),
  workspaceUpdated: document.getElementById('workspace-updated'),
  workspaceAssignee: document.getElementById('workspace-assignee'),
  workspaceTaskStatus: document.getElementById('workspace-task-status'),
  workspaceSessionChip: document.getElementById('workspace-session-chip'),
  workspaceCurrentActivity: document.getElementById('workspace-current-activity'),
  workspaceActiveTab: document.getElementById('workspace-active-tab'),
  startTimerButton: document.getElementById('start-timer-button'),
  pauseTimerButton: document.getElementById('pause-timer-button'),
  resetTimerButton: document.getElementById('reset-timer-button'),
  commentsList: document.getElementById('comments-list'),
  commentForm: document.getElementById('comment-form'),
  commentInput: document.getElementById('comment-input'),
  chatEmpty: document.getElementById('chat-empty'),
  chatPanel: document.getElementById('chat-panel'),
  chatSuggestions: document.getElementById('chat-suggestions'),
  chatMessages: document.getElementById('chat-messages'),
  chatLoading: document.getElementById('chat-loading'),
  chatForm: document.getElementById('chat-form'),
  chatInput: document.getElementById('chat-input'),
  assistantContextTitle: document.getElementById('assistant-context-title'),
  assistantContextCopy: document.getElementById('assistant-context-copy'),
  backendUrlInput: document.getElementById('backend-url-input'),
  authTokenInput: document.getElementById('auth-token-input'),
  authForm: document.getElementById('auth-form'),
  authEmailInput: document.getElementById('auth-email-input'),
  authPasswordInput: document.getElementById('auth-password-input'),
  loginButton: document.getElementById('login-button'),
  registerButton: document.getElementById('register-button'),
  authStatusMessage: document.getElementById('auth-status-message'),
  refreshBackendButton: document.getElementById('refresh-backend-button'),
  syncTasksButton: document.getElementById('sync-tasks-button'),
  backendStatusDot: document.getElementById('backend-status-dot'),
  backendStatusLabel: document.getElementById('backend-status-label'),
  aiStatusDot: document.getElementById('ai-status-dot'),
  aiStatusLabel: document.getElementById('ai-status-label'),
  aiModelLabel: document.getElementById('ai-model-label'),
  aiKeyPreview: document.getElementById('ai-key-preview'),
  assistantFooterProvider: document.getElementById('assistant-footer-provider'),
  productivityInsightSwitch: document.getElementById('productivity-insight-switch'),
  productivityInsightTopTask: document.getElementById('productivity-insight-top-task')
};

const state = {
  tasks: [],
  activeTaskId: null,
  timerId: null,
  activityTimerId: null,
  switchCount: 0,
  api: {
    baseUrl: DEFAULT_BASE_URL,
    token: '',
    email: ''
  },
  backendStatus: {
    online: false,
    provider: 'Gemini',
    model: 'gemini-1.5-flash',
    apiKeyPreview: 'Unknown',
    fallbackMode: true
  }
};

const priorityMap = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
  critical: 'Critical'
};

const backendPriorityMap = {
  Critical: 'high',
  High: 'high',
  Medium: 'medium',
  Low: 'low'
};

const backendStatusMap = {
  Active: 'todo',
  'In Progress': 'in_progress',
  Paused: 'todo',
  Completed: 'done'
};

const frontendStatusMap = {
  todo: 'Active',
  in_progress: 'In Progress',
  done: 'Completed',
  Active: 'Active',
  'In Progress': 'In Progress',
  Paused: 'Paused',
  Completed: 'Completed'
};

const suggestionTemplates = [
  'Show an example of a task creation API.',
  'Best practices for Node.js backend performance?',
  'How should I structure the API endpoints?'
];

const mockActivities = [
  { activity: 'Writing API routes', tab: 'VS Code - routes.ts' },
  { activity: 'Fixing bug in auth middleware', tab: 'VS Code - auth.js' },
  { activity: 'Reviewing pull request', tab: 'GitHub - PR review' },
  { activity: 'Running unit tests', tab: 'Terminal - npm test' },
  { activity: 'Optimizing DB query', tab: 'VS Code - database.ts' },
  { activity: 'Reading documentation', tab: 'Browser - Docs' },
  { activity: 'Debugging API', tab: 'Postman - Auth collection' }
];

function normalizeBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).trim().replace(/\/$/, '');
}

function getRandomActivityDelay() {
  return (10 + Math.floor(Math.random() * 11)) * 1000;
}

function getRandomActivitySnapshot() {
  return mockActivities[Math.floor(Math.random() * mockActivities.length)];
}

function getActiveTask() {
  return state.tasks.find((task) => task.id === state.activeTaskId) || null;
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDurationCompact(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatTimestamp(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function createId() {
  return crypto?.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function createComment(author, text, timestamp = new Date().toISOString()) {
  return {
    id: createId(),
    author,
    text,
    timestamp
  };
}

function normalizeTask(task) {
  const now = Date.now();
  const legacyTimeSpent = Math.max(0, Number(task.timeSpent) || 0);
  const hasSessions = Array.isArray(task.sessions) && task.sessions.length > 0;
  const sessions = hasSessions
    ? task.sessions
        .map((session) => ({
          startTime: Number(session.startTime) || now,
          endTime: Number.isFinite(session.endTime) ? Number(session.endTime) : null,
          status: ['active', 'idle', 'paused'].includes(session.status) ? session.status : 'paused',
          activity: session.activity || task.activity || 'Reviewing task scope',
          tab: session.tab || task.tab || 'FlowMind Dashboard',
          lastActivityAt: Number(session.lastActivityAt) || Number(session.startTime) || now,
          nextActivityChangeAt: Number(session.nextActivityChangeAt) || 0
        }))
        .sort((a, b) => a.startTime - b.startTime)
    : [
        {
          startTime: now - (legacyTimeSpent * 1000),
          endTime: task.isRunning ? null : now,
          status: task.isRunning ? 'active' : 'paused',
          activity: task.activity || 'Reviewing task scope',
          tab: task.tab || 'FlowMind Dashboard',
          lastActivityAt: now,
          nextActivityChangeAt: 0
        }
      ];

  return {
    id: task.id || createId(),
    title: task.title || 'Untitled task',
    description: task.description || 'No description provided yet.',
    priority: priorityMap[task.priority] || 'Medium',
    status: frontendStatusMap[task.status] || 'Paused',
    assignee: task.assignee || 'Rajesh',
    sessions,
    totalTime: Number(task.totalTime) || 0,
    lastUpdated: task.lastUpdated || new Date().toISOString(),
    source: task.source || 'local',
    comments: Array.isArray(task.comments) ? task.comments : [],
    chatHistory: Array.isArray(task.chatHistory) ? task.chatHistory : []
  };
}

function defaultTasks() {
  const now = new Date().toISOString();
  const nowMs = Date.now();
  return [
    normalizeTask({
      id: createId(),
      title: 'Build Backend API',
      description: 'Develop the backend API to handle user tasks and chat messages.',
      priority: 'High',
      status: 'Active',
      assignee: 'Rajesh',
      sessions: [
        {
          startTime: nowMs - 5724 * 1000,
          endTime: null,
          status: 'active',
          activity: 'Writing API routes',
          tab: 'VS Code - auth.routes.ts',
          lastActivityAt: nowMs,
          nextActivityChangeAt: 0
        }
      ],
      lastUpdated: now,
      comments: [
        createComment('Rajesh', 'Setting up the database schema and routes.', now),
        createComment('Sarah', 'Can you make sure the API supports pagination?', now)
      ],
      chatHistory: []
    }),
    normalizeTask({
      id: createId(),
      title: 'Fix UI Bug',
      description: 'Resolve layout overflow and button state issues in the dashboard workspace.',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'Sarah',
      sessions: [
        {
          startTime: nowMs - 2700 * 1000,
          endTime: nowMs,
          status: 'paused',
          activity: 'Debugging layout overflow',
          tab: 'Chrome - Dashboard',
          lastActivityAt: nowMs,
          nextActivityChangeAt: 0
        }
      ],
      lastUpdated: now,
      comments: [createComment('Sarah', 'I narrowed the issue down to the task rail width.', now)]
    }),
    normalizeTask({
      id: createId(),
      title: 'Write Documentation',
      description: 'Capture auth setup, required environment variables, and deployment notes.',
      priority: 'Low',
      status: 'Paused',
      assignee: 'Rooe',
      sessions: [
        {
          startTime: nowMs - 4200 * 1000,
          endTime: nowMs,
          status: 'paused',
          activity: 'Reading documentation',
          tab: 'Notion - Docs',
          lastActivityAt: nowMs,
          nextActivityChangeAt: 0
        }
      ],
      lastUpdated: now
    })
  ];
}

function saveState() {
  const payload = {
    tasks: state.tasks,
    activeTaskId: state.activeTaskId,
    switchCount: state.switchCount,
    api: state.api
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      state.tasks = defaultTasks();
      state.activeTaskId = state.tasks[0]?.id || null;
      saveState();
      return;
    }

    const parsed = JSON.parse(raw);
    state.tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(normalizeTask) : defaultTasks();
    state.activeTaskId = parsed.activeTaskId || state.tasks[0]?.id || null;
    state.switchCount = Number(parsed.switchCount) || 0;
    state.api.baseUrl = normalizeBaseUrl(parsed.api?.baseUrl || DEFAULT_BASE_URL);
    state.api.token = parsed.api?.token || '';
    state.api.email = parsed.api?.email || '';
  } catch {
    state.tasks = defaultTasks();
    state.activeTaskId = state.tasks[0]?.id || null;
  }

}

function getCurrentSession(task) {
  return task.sessions.find((session) => session.endTime === null) || null;
}

function getTaskStatus(task) {
  const currentSession = getCurrentSession(task);
  if (currentSession) return currentSession.status;
  const lastSession = task.sessions[task.sessions.length - 1];
  return lastSession?.status || 'paused';
}

function getTaskTotalTime(task, now = Date.now()) {
  return task.sessions.reduce((sum, session) => {
    const end = session.endTime === null ? now : session.endTime;
    return sum + Math.max(0, Math.floor((end - session.startTime) / 1000));
  }, 0);
}

function getTaskActivity(task) {
  const currentSession = getCurrentSession(task);
  if (currentSession) return currentSession.activity;
  const lastSession = task.sessions[task.sessions.length - 1];
  return lastSession?.activity || 'Waiting for next action';
}

function getTaskTab(task) {
  const currentSession = getCurrentSession(task);
  if (currentSession) return currentSession.tab;
  const lastSession = task.sessions[task.sessions.length - 1];
  return lastSession?.tab || 'FlowMind Dashboard';
}

function syncInputsFromState() {
  if (elements.backendUrlInput) elements.backendUrlInput.value = state.api.baseUrl;
  if (elements.authTokenInput) elements.authTokenInput.value = state.api.token;
  if (elements.authEmailInput) elements.authEmailInput.value = state.api.email;
}

function setDotState(node, kind) {
  if (!node) return;
  node.className = 'status-dot';
  if (kind) node.classList.add(kind);
}

async function apiRequest(path, options = {}) {
  const url = `${normalizeBaseUrl(state.api.baseUrl)}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (state.api.token) {
    headers.set('Authorization', `Bearer ${state.api.token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Request failed with status ${response.status}`);
  }

  return payload;
}

async function loadBackendStatus() {
  state.api.baseUrl = normalizeBaseUrl(elements.backendUrlInput?.value || state.api.baseUrl);
  state.api.token = elements.authTokenInput?.value.trim() || '';
  saveState();

  setDotState(elements.backendStatusDot, 'warning');
  setDotState(elements.aiStatusDot, 'warning');
  if (elements.backendStatusLabel) elements.backendStatusLabel.textContent = 'Checking backend';
  if (elements.aiStatusLabel) elements.aiStatusLabel.textContent = 'Checking AI toolkit';

  try {
    const [statusPayload, aiPayload] = await Promise.all([
      apiRequest('/v1/status', { method: 'GET' }),
      apiRequest('/v1/system/ai-status', { method: 'GET' })
    ]);

    state.backendStatus = {
      online: true,
      provider: aiPayload?.data?.provider || statusPayload?.provider || 'Gemini',
      model: aiPayload?.data?.model || 'gemini-1.5-flash',
      apiKeyPreview: aiPayload?.data?.apiKeyPreview || 'Unavailable',
      fallbackMode: Boolean(aiPayload?.data?.fallbackMode)
    };

    setDotState(elements.backendStatusDot, 'success');
    setDotState(elements.aiStatusDot, state.backendStatus.fallbackMode ? 'warning' : 'success');
    if (elements.backendStatusLabel) elements.backendStatusLabel.textContent = 'Backend API connected';
    if (elements.aiStatusLabel) {
      elements.aiStatusLabel.textContent = state.backendStatus.fallbackMode
        ? 'Gemini fallback mode'
        : 'Gemini API key configured';
    }
    if (elements.aiModelLabel) elements.aiModelLabel.textContent = state.backendStatus.model;
    if (elements.aiKeyPreview) elements.aiKeyPreview.textContent = state.backendStatus.apiKeyPreview;
    if (elements.assistantFooterProvider) elements.assistantFooterProvider.textContent = state.backendStatus.provider;
  } catch (error) {
    state.backendStatus.online = false;
    setDotState(elements.backendStatusDot, 'error');
    setDotState(elements.aiStatusDot, 'error');
    if (elements.backendStatusLabel) {
      elements.backendStatusLabel.textContent = error instanceof Error ? error.message : 'Backend unavailable';
    }
    if (elements.aiStatusLabel) elements.aiStatusLabel.textContent = 'AI toolkit unavailable';
    if (elements.aiKeyPreview) elements.aiKeyPreview.textContent = 'Unavailable';
  }
}

function mergeTask(remoteTask) {
  const existing = state.tasks.find((task) => task.id === remoteTask.id);
  const merged = normalizeTask({
    ...existing,
    ...remoteTask,
    source: 'backend',
    sessions: existing?.sessions,
    totalTime: existing?.totalTime || remoteTask.totalTime || 0,
    assignee: existing?.assignee || 'Rajesh',
    comments: existing?.comments || [],
    chatHistory: existing?.chatHistory || []
  });

  if (existing) {
    state.tasks = state.tasks.map((task) => (task.id === merged.id ? merged : task));
  } else {
    state.tasks.unshift(merged);
  }
}

async function syncTasksFromBackend() {
  if (!state.api.token) {
    if (elements.backendStatusLabel) elements.backendStatusLabel.textContent = 'Add bearer token to sync tasks';
    setDotState(elements.backendStatusDot, 'warning');
    return;
  }

  try {
    const payload = await apiRequest('/v1/tasks', { method: 'GET' });
    const remoteTasks = Array.isArray(payload?.data) ? payload.data : [];
    remoteTasks.forEach((task) => mergeTask(task));
    if (!state.activeTaskId && state.tasks[0]) {
      state.activeTaskId = state.tasks[0].id;
    }
    saveState();
    renderAll();
    if (elements.backendStatusLabel) {
      elements.backendStatusLabel.textContent = `Synced ${remoteTasks.length} backend task${remoteTasks.length === 1 ? '' : 's'}`;
    }
    setDotState(elements.backendStatusDot, 'success');
  } catch (error) {
    if (elements.backendStatusLabel) {
      elements.backendStatusLabel.textContent = error instanceof Error ? error.message : 'Task sync failed';
    }
    setDotState(elements.backendStatusDot, 'error');
  }
}

function updateTask(taskId, updater) {
  state.tasks = state.tasks.map((task) => {
    if (task.id !== taskId) return task;
    const nextTask = normalizeTask({ ...task, ...updater(task), lastUpdated: new Date().toISOString() });
    return {
      ...nextTask,
      totalTime: getTaskTotalTime(nextTask)
    };
  });
  saveState();
}

function renderTaskTabs() {
  if (!elements.taskTabs) return;
  elements.taskTabs.innerHTML = '';
  if (elements.taskCountBadge) elements.taskCountBadge.textContent = String(state.tasks.length);

  state.tasks.forEach((task) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `task-tab ${state.activeTaskId === task.id ? 'is-active' : ''}`;
    button.addEventListener('click', () => setActiveTask(task.id));

    const head = document.createElement('div');
    head.className = 'task-tab-head';

    const titleWrap = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'task-tab-title';
    title.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = task.priority;

    titleWrap.append(title, meta);

    const taskStatus = getTaskStatus(task);
    const isActive = taskStatus === 'active';
    const isIdle = taskStatus === 'idle';
    const totalTime = getTaskTotalTime(task);

    button.classList.toggle('is-running', isActive);
    button.classList.toggle('is-idle', isIdle);
    button.classList.toggle('is-paused', taskStatus === 'paused');

    const time = document.createElement('span');
    time.className = 'task-mini-time';
    time.textContent = formatDurationCompact(totalTime);

    head.append(titleWrap, time);

    const activity = document.createElement('p');
    activity.className = 'task-activity';
    activity.textContent = getTaskActivity(task);

    const foot = document.createElement('div');
    foot.className = 'task-tab-foot';

    const status = document.createElement('span');
    status.className = `task-status-badge ${isActive ? 'active' : ''}`;
    const dot = document.createElement('span');
    dot.className = `status-dot ${isActive ? 'success pulsing' : isIdle ? 'warning' : ''}`.trim();
    const text = document.createElement('span');
    text.textContent = isActive ? 'Active' : isIdle ? 'Idle' : 'Paused';
    status.append(dot, text);

    if (isIdle) {
      const idleLabel = document.createElement('span');
      idleLabel.className = 'task-idle-label';
      idleLabel.textContent = 'Idle';
      foot.appendChild(idleLabel);
    }

    const updated = document.createElement('span');
    updated.className = 'task-meta';
    updated.textContent = formatTimestamp(task.lastUpdated);

    foot.append(status, updated);
    button.append(head, activity, foot);
    elements.taskTabs.appendChild(button);
  });
}

function renderHeaderMetrics() {
  const totalTime = state.tasks.reduce((sum, task) => sum + getTaskTotalTime(task), 0);
  if (elements.focusedTotal) elements.focusedTotal.textContent = formatDurationCompact(totalTime);
  if (elements.switchCount) {
    elements.switchCount.textContent = `${state.switchCount} Switch${state.switchCount === 1 ? '' : 'es'}`;
  }
  const topTask = state.tasks
    .map((task) => ({ title: task.title, total: getTaskTotalTime(task) }))
    .sort((a, b) => b.total - a.total)[0];
  if (elements.productivityInsightSwitch) {
    elements.productivityInsightSwitch.textContent = `You switched tasks ${state.switchCount} times in the last hour`;
  }
  if (elements.productivityInsightTopTask) {
    elements.productivityInsightTopTask.textContent = topTask
      ? `Most time spent on: ${topTask.title}`
      : 'Most time spent on: —';
  }
}

function renderComments(task) {
  if (!elements.commentsList) return;
  elements.commentsList.innerHTML = '';
  task.comments.forEach((comment) => {
    const item = document.createElement('article');
    item.className = 'comment-item';

    const avatar = document.createElement('div');
    avatar.className = 'comment-avatar';
    avatar.textContent = comment.author.slice(0, 2).toUpperCase();

    const content = document.createElement('div');
    content.className = 'comment-content';

    const authorLine = document.createElement('div');
    authorLine.className = 'comment-author-line';

    const author = document.createElement('span');
    author.className = 'comment-author';
    author.textContent = comment.author;

    const timestamp = document.createElement('span');
    timestamp.className = 'comment-timestamp';
    timestamp.textContent = formatTimestamp(comment.timestamp);

    const text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment.text;

    authorLine.append(author, timestamp);
    content.append(authorLine, text);
    item.append(avatar, content, document.createElement('div'));
    elements.commentsList.appendChild(item);
  });
}

function renderWorkspace() {
  const activeTask = getActiveTask();
  if (!activeTask) {
    elements.workspaceEmpty?.classList.remove('hidden');
    elements.workspaceContent?.classList.add('hidden');
    return;
  }

  elements.workspaceEmpty?.classList.add('hidden');
  elements.workspaceContent?.classList.remove('hidden');
  elements.workspaceTaskTitle.textContent = activeTask.title;
  elements.workspaceTaskDescription.textContent = activeTask.description;
  const totalTime = getTaskTotalTime(activeTask);
  const currentStatus = getTaskStatus(activeTask);
  elements.workspaceMiniTime.textContent = formatDuration(totalTime);
  elements.workspaceTimer.textContent = formatDuration(totalTime);
  elements.workspacePriority.textContent = activeTask.priority;
  elements.workspaceUpdated.textContent = formatTimestamp(activeTask.lastUpdated);
  elements.workspaceAssignee.textContent = activeTask.assignee;
  elements.workspaceTaskStatus.textContent = currentStatus === 'active' ? 'In Progress' : currentStatus[0].toUpperCase() + currentStatus.slice(1);
  elements.workspaceSessionChip.textContent = currentStatus === 'active' ? 'Active session' : currentStatus === 'idle' ? 'Idle session' : 'Paused';
  elements.workspaceSessionChip.classList.toggle('running', currentStatus === 'active');
  if (elements.workspaceCurrentActivity) elements.workspaceCurrentActivity.textContent = getTaskActivity(activeTask);
  if (elements.workspaceActiveTab) elements.workspaceActiveTab.textContent = getTaskTab(activeTask);
  renderComments(activeTask);
}

function appendFormattedMessage(container, message) {
  const parts = String(message || '').split(/```/);
  parts.forEach((part, index) => {
    if (!part.trim()) return;
    if (index % 2 === 1) {
      const header = document.createElement('div');
      header.className = 'message-code-header';
      header.textContent = 'Code';
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = part.trim();
      pre.appendChild(code);
      container.append(header, pre);
      return;
    }
    const paragraph = document.createElement('p');
    paragraph.textContent = part.trim();
    container.appendChild(paragraph);
  });
}

function renderChatMessages(task) {
  if (!elements.chatMessages) return;
  elements.chatMessages.innerHTML = '';
  task.chatHistory.forEach((message) => {
    const article = document.createElement('article');
    article.className = `message-bubble ${message.role}`;

    const header = document.createElement('div');
    header.className = 'message-header';
    const role = document.createElement('span');
    role.className = 'message-role';
    role.textContent = message.role === 'user' ? message.author || task.assignee : 'FlowMind AI';

    const timestamp = document.createElement('span');
    timestamp.className = 'task-meta';
    timestamp.textContent = formatTimestamp(message.timestamp);

    const body = document.createElement('div');
    body.className = 'message-body';
    appendFormattedMessage(body, message.content);

    header.append(role, timestamp);
    article.append(header, body);
    elements.chatMessages.appendChild(article);
  });

  requestAnimationFrame(() => {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  });
}

function renderSuggestions(task) {
  if (!elements.chatSuggestions) return;
  elements.chatSuggestions.innerHTML = '';
  suggestionTemplates.forEach((suggestion) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-chip';
    button.textContent = suggestion;
    button.addEventListener('click', () => {
      elements.chatInput.value = suggestion;
      elements.chatInput.focus();
    });
    elements.chatSuggestions.appendChild(button);
  });

  if (task.chatHistory.length > 0) {
    elements.chatSuggestions.classList.add('hidden');
  } else {
    elements.chatSuggestions.classList.remove('hidden');
  }
}

function ensureTaskHasIntro(task) {
  if (task.chatHistory.length > 0) return;
  updateTask(task.id, () => ({
    chatHistory: [
      {
        id: createId(),
        role: 'assistant',
        content: `I’m attached to ${task.title}. Ask for endpoint design, implementation help, refactoring guidance, or a code example.`,
        timestamp: new Date().toISOString()
      }
    ]
  }));
}

function renderChat() {
  const activeTask = getActiveTask();
  if (!activeTask) {
    elements.chatEmpty?.classList.remove('hidden');
    elements.chatPanel?.classList.add('hidden');
    elements.assistantContextTitle.textContent = 'No task selected';
    elements.assistantContextCopy.textContent = 'Select a task to tie the assistant to a task-specific conversation.';
    return;
  }

  ensureTaskHasIntro(activeTask);
  const updatedTask = getActiveTask();
  elements.chatEmpty?.classList.add('hidden');
  elements.chatPanel?.classList.remove('hidden');
  elements.assistantContextTitle.textContent = updatedTask.title;
  elements.assistantContextCopy.textContent = updatedTask.description;
  renderSuggestions(updatedTask);
  renderChatMessages(updatedTask);
}

function renderAll() {
  renderTaskTabs();
  renderHeaderMetrics();
  renderWorkspace();
  renderChat();
}

function startTimer() {
  const activeTask = getActiveTask();
  if (!activeTask) return;
  updateTask(activeTask.id, (task) => {
    const now = Date.now();
    const currentSession = getCurrentSession(task);
    if (currentSession) {
      return {
        sessions: task.sessions.map((session) => (
          session.endTime === null
            ? {
                ...session,
                status: 'active',
                lastActivityAt: now,
                nextActivityChangeAt: now + getRandomActivityDelay()
              }
            : session
        ))
      };
    }
    return {
      sessions: [
        ...task.sessions,
        {
          startTime: now,
          endTime: null,
          status: 'active',
          activity: getTaskActivity(task),
          tab: getTaskTab(task),
          lastActivityAt: now,
          nextActivityChangeAt: now + getRandomActivityDelay()
        }
      ]
    };
  });
  renderAll();
}

function pauseTimer() {
  const activeTask = getActiveTask();
  if (!activeTask) return;
  updateTask(activeTask.id, (task) => ({
    sessions: task.sessions.map((session) => (
      session.endTime === null
        ? { ...session, status: 'paused', endTime: Date.now() }
        : session
    ))
  }));
  renderAll();
}

function resetTimer() {
  const activeTask = getActiveTask();
  if (!activeTask) return;
  updateTask(activeTask.id, () => ({
    sessions: []
  }));
  renderAll();
}

function tickTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = window.setInterval(() => {
    renderTaskTabs();
    renderHeaderMetrics();
    renderWorkspace();
  }, 1000);
}

function runActivitySimulation() {
  if (state.activityTimerId) clearInterval(state.activityTimerId);
  state.activityTimerId = window.setInterval(() => {
    const now = Date.now();
    let changed = false;

    state.tasks = state.tasks.map((task) => {
      let taskChanged = false;
      const sessions = task.sessions.map((session) => {
        if (session.endTime !== null || session.status === 'paused') return session;
        let nextSession = session;

        if (session.nextActivityChangeAt === 0 || now >= session.nextActivityChangeAt) {
          const nextActivity = getRandomActivitySnapshot();
          nextSession = {
            ...nextSession,
            status: 'active',
            activity: nextActivity.activity,
            tab: nextActivity.tab,
            lastActivityAt: now,
            nextActivityChangeAt: now + getRandomActivityDelay()
          };
          taskChanged = true;
        } else if (now - session.lastActivityAt >= 15000 && session.status !== 'idle') {
          nextSession = {
            ...nextSession,
            status: 'idle'
          };
          taskChanged = true;
        }

        return nextSession;
      });

      if (taskChanged) {
        changed = true;
        const normalized = normalizeTask({ ...task, sessions, lastUpdated: new Date().toISOString() });
        return { ...normalized, totalTime: getTaskTotalTime(normalized, now) };
      }
      return task;
    });

    if (changed) {
      saveState();
      renderTaskTabs();
      renderHeaderMetrics();
      renderWorkspace();
    }
  }, 1000);
}

function setActiveTask(taskId) {
  if (state.activeTaskId && state.activeTaskId !== taskId) {
    state.switchCount += 1;
    saveState();
  }

  state.activeTaskId = taskId;
  saveState();
  renderAll();
  void loadChatHistoryForTask(getActiveTask());
}

async function persistTaskToBackend(task) {
  if (!state.api.token) return;

  try {
    if (task.source === 'backend') return;
    const payload = await apiRequest('/v1/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: backendPriorityMap[task.priority] || 'medium',
        status: backendStatusMap[task.status] || 'todo'
      })
    });

    const created = payload?.data;
    if (created?.id) {
      state.tasks = state.tasks.map((item) => {
        if (item.id !== task.id) return item;
        return normalizeTask({
          ...item,
          id: created.id,
          title: created.title,
          description: created.description,
          priority: created.priority,
          status: created.status,
          source: 'backend'
        });
      });
      if (state.activeTaskId === task.id) {
        state.activeTaskId = created.id;
      }
      saveState();
      renderAll();
    }
  } catch (error) {
    if (elements.backendStatusLabel) {
      elements.backendStatusLabel.textContent = error instanceof Error ? error.message : 'Task not saved to backend';
    }
  }
}

function handleTaskCreate(event) {
  event.preventDefault();
  const task = normalizeTask({
    id: createId(),
    title: elements.taskTitleInput.value.trim(),
    description: elements.taskDescriptionInput.value.trim(),
    priority: elements.taskPriorityInput.value,
    status: 'Active',
    assignee: elements.taskAssigneeInput.value.trim() || 'Rajesh',
    sessions: [],
    lastUpdated: new Date().toISOString(),
    comments: [createComment(elements.taskAssigneeInput.value.trim() || 'Rajesh', 'Task session created and ready for execution.')],
    chatHistory: []
  });

  if (!task.title || !task.description) return;

  state.tasks.unshift(task);
  state.activeTaskId = task.id;
  elements.taskForm.reset();
  saveState();
  renderAll();
  void persistTaskToBackend(task);
}

function handleCommentSubmit(event) {
  event.preventDefault();
  const activeTask = getActiveTask();
  const commentText = elements.commentInput.value.trim();
  if (!activeTask || !commentText) return;

  updateTask(activeTask.id, (task) => ({
    comments: [...task.comments, createComment(task.assignee || 'Rajesh', commentText)]
  }));
  elements.commentInput.value = '';
  renderWorkspace();
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const activeTask = getActiveTask();
  const content = elements.chatInput.value.trim();
  if (!activeTask || !content) return;

  const userMessage = {
    id: createId(),
    role: 'user',
    author: activeTask.assignee || 'Rajesh',
    content,
    timestamp: new Date().toISOString()
  };

  updateTask(activeTask.id, (task) => ({
    chatHistory: [...task.chatHistory, userMessage]
  }));
  elements.chatInput.value = '';
  elements.chatLoading.classList.remove('hidden');
  renderChat();

  try {
    if (!state.api.token) {
      throw new Error('Add a bearer token to use the authenticated chat API');
    }

    const payload = await apiRequest('/v1/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        content,
        taskId: activeTask.source === 'backend' ? activeTask.id : undefined
      })
    });

    const assistantContent =
      payload?.data?.response?.content ||
      payload?.data?.messages?.find((message) => message.role === 'assistant')?.content ||
      'The AI service responded without a message body.';

    updateTask(activeTask.id, (task) => ({
      chatHistory: [
        ...task.chatHistory,
        {
          id: createId(),
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  } catch (error) {
    updateTask(activeTask.id, (task) => ({
      chatHistory: [
        ...task.chatHistory,
        {
          id: createId(),
          role: 'assistant',
          content: error instanceof Error
            ? `I couldn’t reach the backend assistant right now. ${error.message}`
            : 'I couldn’t reach the backend assistant right now.',
          timestamp: new Date().toISOString()
        }
      ]
    }));
  } finally {
    elements.chatLoading.classList.add('hidden');
    renderChat();
  }
}

function setAuthStatus(message) {
  if (elements.authStatusMessage) {
    elements.authStatusMessage.textContent = message;
  }
}

async function authenticate(mode) {
  const email = elements.authEmailInput?.value.trim().toLowerCase() || '';
  const password = elements.authPasswordInput?.value || '';

  if (!email || !password) {
    setAuthStatus('Enter email and password to authenticate with the backend.');
    return;
  }

  try {
    const payload = await apiRequest(`/v1/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const accessToken = payload?.data?.accessToken;
    if (!accessToken) {
      throw new Error('Backend did not return an access token');
    }

    state.api.token = accessToken;
    state.api.email = email;
    if (elements.authTokenInput) {
      elements.authTokenInput.value = accessToken;
    }
    saveState();
    setAuthStatus(`${mode === 'login' ? 'Logged in' : 'Account created'} for ${email}. Syncing tasks…`);
    await loadBackendStatus();
    await syncTasksFromBackend();
  } catch (error) {
    setAuthStatus(error instanceof Error ? error.message : 'Authentication failed');
  }
}

async function loadChatHistoryForTask(task) {
  if (!task || !state.api.token || task.source !== 'backend') return;

  try {
    const query = new URLSearchParams({ taskId: task.id });
    const payload = await apiRequest(`/v1/chat/history?${query.toString()}`, { method: 'GET' });
    const history = Array.isArray(payload?.data) ? payload.data : [];
    if (!history.length) return;

    updateTask(task.id, (current) => ({
      chatHistory: history
        .slice()
        .reverse()
        .map((message) => ({
          id: message.id,
          role: message.role,
          author: message.role === 'user' ? current.assignee : 'FlowMind AI',
          content: message.content,
          timestamp: message.createdAt || new Date().toISOString()
        }))
    }));
    renderChat();
  } catch (error) {
    setAuthStatus(error instanceof Error ? error.message : 'Unable to load chat history');
  }
}

function bindEvents() {
  elements.taskForm?.addEventListener('submit', handleTaskCreate);
  elements.commentForm?.addEventListener('submit', handleCommentSubmit);
  elements.chatForm?.addEventListener('submit', handleChatSubmit);
  elements.authForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    void authenticate('login');
  });
  elements.registerButton?.addEventListener('click', () => {
    void authenticate('register');
  });
  elements.startTimerButton?.addEventListener('click', startTimer);
  elements.pauseTimerButton?.addEventListener('click', pauseTimer);
  elements.resetTimerButton?.addEventListener('click', resetTimer);
  elements.refreshBackendButton?.addEventListener('click', () => {
    void loadBackendStatus();
  });
  elements.syncTasksButton?.addEventListener('click', () => {
    void syncTasksFromBackend();
  });
  elements.backendUrlInput?.addEventListener('change', () => {
    state.api.baseUrl = normalizeBaseUrl(elements.backendUrlInput.value);
    saveState();
  });
  elements.authTokenInput?.addEventListener('change', () => {
    state.api.token = elements.authTokenInput.value.trim();
    saveState();
  });
  elements.authEmailInput?.addEventListener('change', () => {
    state.api.email = elements.authEmailInput.value.trim().toLowerCase();
    saveState();
  });
}

loadState();
syncInputsFromState();
bindEvents();
tickTimer();
runActivitySimulation();
renderAll();
if (state.api.email) {
  setAuthStatus(`Ready to use backend account ${state.api.email}.`);
}
void loadBackendStatus();
if (state.api.token) {
  void syncTasksFromBackend();
}
