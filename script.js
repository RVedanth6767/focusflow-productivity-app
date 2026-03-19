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
    keyPreview: 'Checking secure key status'
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
      badge: data?.reachable ? 'Backend Connected' : 'Fallback Active',
      model: data?.model || 'gemini-1.5-flash',
      endpoint: `${statusUrl} // ${data?.status || 'status unavailable'}`,
      keyPreview: data?.configured ? (data?.reachable ? 'Configured securely' : 'Configured, validation failed') : 'Not configured',
      notes: [
        `• Provider reported by backend: <strong>${data?.provider || 'gemini'}</strong>.`,
        `• API key status: <strong>${data?.configured ? 'configured' : 'not configured'}</strong>.`,
        `• Active model route: <strong>${data?.model || 'gemini-1.5-flash'}</strong>.`,
        `• Gemini reachability is <strong>${data?.reachable ? 'healthy' : 'unavailable'}</strong>.`,
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
setupAiToolkit();
