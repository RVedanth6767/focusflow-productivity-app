const particlesRoot = document.getElementById('particles');
const typedText = document.getElementById('typed-text');
const logFeed = document.getElementById('log-feed');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]'));
const revealNodes = Array.from(document.querySelectorAll('.system-card, .info-panel, .mini-stat, .status-row'));
const backendUrlInput = document.getElementById('backend-url-input');
const backendUrlButton = document.getElementById('backend-url-button');
const providerNode = document.querySelector('[data-ai-provider]');
const backendNode = document.querySelector('[data-ai-backend]');
const fallbackNode = document.querySelector('[data-ai-fallback]');
const badgeNode = document.querySelector('[data-ai-badge]');
const modelNode = document.querySelector('[data-ai-model]');
const endpointNode = document.querySelector('[data-ai-endpoint]');
const keyNode = document.querySelector('[data-ai-key]');
const notesNode = document.getElementById('ai-status-notes');
const workspaceNode = document.getElementById('workspace');
const chatMessagesNode = document.getElementById('chat-messages');
const chatInputNode = document.getElementById('chat-input');
const chatSendButton = document.getElementById('chat-send-button');
const chatLoadButton = document.getElementById('load-ai-button');
const chatStatusNode = document.getElementById('chat-status');
const heroOpenAiButton = document.getElementById('hero-open-ai');
const heroOpenTasksButton = document.getElementById('hero-open-tasks');
const taskFormNode = document.getElementById('task-form');
const taskNameNode = document.getElementById('task-name');
const taskPriorityNode = document.getElementById('task-priority');
const taskNotesNode = document.getElementById('task-notes');
const taskAllocationListNode = document.getElementById('task-allocation-list');
const taskStorageKey = 'focusflow-task-allocations';
const initialTaskAllocations = [
  {
    name: 'Resolve launch blocker',
    priority: 'critical',
    notes: 'Escalated tasks are routed into the nearest uninterrupted focus window.'
  },
  {
    name: 'Review roadmap dependencies',
    priority: 'high',
    notes: 'High-priority items are scheduled into the next meaningful working session.'
  }
];
const aiResponses = [
  'I can summarize your priorities, break down a complex task, or help you plan your next focus sprint.',
  'Try asking for a time-blocked plan, a concise summary, or a list of immediate next actions.',
  'I recommend defining your top objective first, then I can turn it into a fast execution checklist.'
];


const terminalPhrases = [
  'Initializing neural focus matrix',
  'Syncing autonomous workflow engine',
  'Calibrating classified productivity signals',
  'Deploying adaptive AI assistance protocols',
];

const systemLogs = [
  '[00:01] Focus mode lock engaged // channel stable',
  '[00:04] Task Engine rerouted 12 high-priority actions',
  '[00:09] AI Assistant generated 4 strategic summaries',
  '[00:12] Analytics node detected +28% output surge',
  '[00:16] Signal integrity verified across all dashboards',
];

function createParticles(count = 42) {
  if (!particlesRoot) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    const size = Math.random() * 3 + 1;
    particle.className = 'particle';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
    particle.style.animationDuration = `${Math.random() * 12 + 14}s`;
    particle.style.animationDelay = `${Math.random() * -16}s`;
    fragment.appendChild(particle);
  }

  particlesRoot.appendChild(fragment);
}

function runTerminalTyping() {
  if (!typedText) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const phrase = terminalPhrases[phraseIndex];
    typedText.textContent = isDeleting
      ? phrase.slice(0, charIndex--)
      : phrase.slice(0, charIndex++);

    let delay = isDeleting ? 32 : 65;

    if (!isDeleting && charIndex === phrase.length + 1) {
      isDeleting = true;
      delay = 1200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % terminalPhrases.length;
      delay = 280;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function streamLogs() {
  if (!logFeed) return;

  let index = 0;

  const pushLog = () => {
    const log = document.createElement('p');
    log.textContent = systemLogs[index % systemLogs.length];
    log.className = 'text-cyan-50/75';
    logFeed.prepend(log);

    while (logFeed.children.length > 4) {
      logFeed.removeChild(logFeed.lastElementChild);
    }

    index += 1;
  };

  pushLog();
  pushLog();
  pushLog();
  window.setInterval(pushLog, 1800);
}

function setupRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  revealNodes.forEach((node) => node.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupNavSpy() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const updateActiveLink = () => {
    const scrollMarker = window.scrollY + window.innerHeight * 0.25;
    let activeSectionId = '#hero';

    sections.forEach((section) => {
      if (scrollMarker >= section.offsetTop) {
        activeSectionId = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === activeSectionId);
    });
  };

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

function setupParallax() {
  if (!parallaxNodes.length) return;

  const updateParallax = () => {
    const viewportMiddle = window.innerHeight / 2;

    parallaxNodes.forEach((node) => {
      const rate = Number(node.dataset.parallax || 0);
      const rect = node.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportMiddle) * rate;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function appendChatMessage(role, message) {
  if (!chatMessagesNode) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`;

  const roleLabel = document.createElement('span');
  roleLabel.className = 'chat-role';
  roleLabel.textContent = role === 'user' ? 'Operator' : 'FocusFlow AI';

  const textNode = document.createElement('p');
  textNode.textContent = message;

  bubble.append(roleLabel, textNode);
  chatMessagesNode.appendChild(bubble);
  chatMessagesNode.scrollTop = chatMessagesNode.scrollHeight;
}

function setChatReadyState(isReady) {
  if (chatInputNode) chatInputNode.disabled = !isReady;
  if (chatSendButton) chatSendButton.disabled = !isReady;
  if (chatStatusNode) chatStatusNode.textContent = isReady ? 'Secure Session' : 'Standby Mode';
}

function sendMessage() {
  if (!chatInputNode) return;

  const message = chatInputNode.value.trim();
  if (!message) return;

  appendChatMessage('user', message);
  chatInputNode.value = '';

  const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  window.setTimeout(() => {
    appendChatMessage('ai', response);
  }, 240);
}

function loadAI() {
  if (!workspaceNode || !chatMessagesNode) return;

  scrollToSection('modules');
  chatMessagesNode.innerHTML = '';
  setChatReadyState(true);
  appendChatMessage('ai', 'Console initialized. Ask for a plan, summary, or next action.');

  if (chatLoadButton) {
    chatLoadButton.textContent = 'AI Interface Ready';
    chatLoadButton.disabled = true;
  }

  window.setTimeout(() => {
    if (chatInputNode) {
      chatInputNode.focus();
    }
  }, 350);
}

function setupChatUi() {
  if (chatLoadButton) {
    chatLoadButton.addEventListener('click', loadAI);
  }

  if (heroOpenAiButton) {
    heroOpenAiButton.addEventListener('click', loadAI);
  }

  if (heroOpenTasksButton) {
    heroOpenTasksButton.addEventListener('click', () => {
      scrollToSection('task-system');
    });
  }

  if (chatSendButton) {
    chatSendButton.addEventListener('click', sendMessage);
  }

  if (chatInputNode) {
    chatInputNode.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !chatInputNode.disabled) {
        event.preventDefault();
        sendMessage();
      }
    });
  }
}

const priorityTimingMap = {
  critical: {
    label: 'Critical',
    slot: 'Immediate slot',
    duration: '45 min focus block',
    start: 'Start now',
    note: 'Critical work is pulled into the closest protected execution window.',
    className: 'allocation-card-critical'
  },
  high: {
    label: 'High',
    slot: 'Today',
    duration: '60 min strategy block',
    start: 'Next available session',
    note: 'High-priority work is placed into the next open deep-work block today.',
    className: 'allocation-card-high'
  },
  medium: {
    label: 'Medium',
    slot: 'Within 24 hours',
    duration: '45 min execution block',
    start: 'Tomorrow morning queue',
    note: 'Medium items are grouped into the next planning cycle without displacing urgent work.',
    className: 'allocation-card-medium'
  },
  low: {
    label: 'Low',
    slot: 'Backlog lane',
    duration: '30 min admin block',
    start: 'Next low-intensity window',
    note: 'Low-priority tasks are deferred into lighter support windows.',
    className: 'allocation-card-low'
  }
};

function createTaskAllocationCard(task) {
  const config = priorityTimingMap[task.priority] || priorityTimingMap.medium;
  const card = document.createElement('article');
  card.className = `allocation-card ${config.className}`;

  const contentWrap = document.createElement('div');
  const priorityNode = document.createElement('p');
  priorityNode.className = 'allocation-priority';
  priorityNode.textContent = config.label;

  const titleNode = document.createElement('h4');
  titleNode.className = 'allocation-title';
  titleNode.textContent = task.name;

  const metaNode = document.createElement('p');
  metaNode.className = 'allocation-meta';
  metaNode.textContent = `${config.slot} • ${config.duration} • ${config.start}`;

  contentWrap.append(priorityNode, titleNode, metaNode);

  const notesNodeLocal = document.createElement('p');
  notesNodeLocal.className = 'allocation-notes';
  notesNodeLocal.textContent = task.notes || config.note;

  card.append(contentWrap, notesNodeLocal);
  return card;
}

function readSavedTaskAllocations() {
  try {
    const raw = localStorage.getItem(taskStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTaskAllocations(tasks) {
  localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
}

function renderTaskAllocations(tasks) {
  if (!taskAllocationListNode) return;

  taskAllocationListNode.innerHTML = '';
  tasks.forEach((task) => {
    taskAllocationListNode.appendChild(createTaskAllocationCard(task));
  });
}

function setupTaskAllocationSystem() {
  if (!taskFormNode || !taskNameNode || !taskPriorityNode || !taskAllocationListNode) return;

  let taskAllocations = [...readSavedTaskAllocations()];

  if (!taskAllocations.length) {
    taskAllocations = [...initialTaskAllocations];
    writeTaskAllocations(taskAllocations);
  }

  renderTaskAllocations(taskAllocations);

  taskFormNode.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskName = taskNameNode.value.trim();
    const priority = taskPriorityNode.value;
    const notes = taskNotesNode?.value.trim() || '';

    if (!taskName) return;

    taskAllocations = [{ name: taskName, priority, notes }, ...taskAllocations].slice(0, 6);
    writeTaskAllocations(taskAllocations);
    renderTaskAllocations(taskAllocations);

    taskFormNode.reset();
    taskPriorityNode.value = 'medium';
    taskNameNode.focus();
  });
}

function normalizeBaseUrl(value) {
  return value.replace(/\/$/, '');
}

function setAiToolkitState({ provider, backend, fallback, badge, model, endpoint, keyPreview, notes }) {
  if (providerNode && provider) providerNode.textContent = provider;
  if (backendNode && backend) backendNode.textContent = backend;
  if (fallbackNode && fallback) fallbackNode.textContent = fallback;
  if (badgeNode && badge) badgeNode.textContent = badge;
  if (modelNode && model) modelNode.textContent = model;
  if (endpointNode && endpoint) endpointNode.textContent = endpoint;
  if (keyNode && keyPreview) keyNode.textContent = keyPreview;

  if (notesNode && Array.isArray(notes)) {
    notesNode.innerHTML = notes.map((note) => `<li>${note}</li>`).join('');
  }
}

async function loadAiToolkitStatus() {
  if (!backendUrlInput) return;

  const baseUrl = normalizeBaseUrl(backendUrlInput.value.trim() || 'http://localhost:4000');
  const statusUrl = `${baseUrl}/v1/system/ai-status`;
  localStorage.setItem('focusflow-backend-url', baseUrl);

  setAiToolkitState({
    backend: 'Checking',
    fallback: 'Detecting',
    badge: 'Syncing Backend',
    endpoint: `Requesting ${statusUrl}`,
    keyPreview: 'Checking backend key status'
  });

  try {
    const response = await fetch(statusUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const data = payload?.data;

    setAiToolkitState({
      provider: data?.provider?.toUpperCase?.() || 'GEMINI',
      backend: 'Online',
      fallback: data?.fallbackMode ? 'Enabled' : 'Off',
      badge: data?.configured ? 'Backend Connected' : 'Fallback Active',
      model: data?.model || 'gemini-1.5-flash',
      endpoint: `${statusUrl} // ${data?.configured ? 'GEMINI_API_KEY detected' : 'GEMINI_API_KEY missing'}`,
      keyPreview: data?.apiKeyPreview || 'Configured',
      notes: [
        `• Provider reported by backend: <strong>${data?.provider || 'gemini'}</strong>.`,
        `• API key preview: <strong>${data?.apiKeyPreview || 'Not configured'}</strong>.`,
        `• Active model route: <strong>${data?.model || 'gemini-1.5-flash'}</strong>.`,
        `• Fallback mode is <strong>${data?.fallbackMode ? 'enabled' : 'disabled'}</strong> based on backend configuration.`
      ]
    });
  } catch (error) {
    setAiToolkitState({
      backend: 'Offline',
      fallback: 'Unknown',
      badge: 'Backend Unreachable',
      endpoint: `${statusUrl} // ${error instanceof Error ? error.message : 'request failed'}`,
      keyPreview: 'Unavailable',
      notes: [
        '• The frontend could not reach the backend AI status route.',
        '• Confirm the backend server is running and CORS allows this origin.',
        '• Update the backend URL field if your API is not hosted on localhost:4000.'
      ]
    });
  }
}

function setupAiToolkit() {
  if (!backendUrlInput || !backendUrlButton) return;

  const savedBaseUrl = localStorage.getItem('focusflow-backend-url');
  if (savedBaseUrl) {
    backendUrlInput.value = savedBaseUrl;
  }

  backendUrlButton.addEventListener('click', () => {
    void loadAiToolkitStatus();
  });

  backendUrlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void loadAiToolkitStatus();
    }
  });

  void loadAiToolkitStatus();
}

createParticles();
runTerminalTyping();
streamLogs();
setupRevealObserver();
setupNavSpy();
setupParallax();
setupChatUi();
setupTaskAllocationSystem();
setupAiToolkit();
