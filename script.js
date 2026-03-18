const particlesRoot = document.getElementById('particles');
const typedText = document.getElementById('typed-text');
const logFeed = document.getElementById('log-feed');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]'));
const revealNodes = Array.from(document.querySelectorAll('.system-card, .info-panel, .mini-stat, .status-row'));

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

createParticles();
runTerminalTyping();
streamLogs();
setupRevealObserver();
setupNavSpy();
setupParallax();
