const DISTRACTION_STORAGE_KEY = 'focusflow.distractions';

const readList = () => {
  try {
    const raw = localStorage.getItem(DISTRACTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeList = (sites) => {
  localStorage.setItem(DISTRACTION_STORAGE_KEY, JSON.stringify(sites));
};

export class DistractionService {
  getSites() {
    return readList();
  }

  addSite(url) {
    const normalized = url.trim();
    if (!normalized) return readList();

    const current = readList();
    if (!current.includes(normalized)) {
      current.push(normalized);
      writeList(current);
    }

    return current;
  }

  /**
   * Basic blocking behavior for a browser app: warn users before opening distractors.
   */
  attemptVisit(url, isFocusActive) {
    const blocked = readList().some((site) => url.includes(site));
    if (isFocusActive && blocked) {
      return {
        allowed: false,
        message: `Focus mode active: ${url} is on your distraction list.`,
      };
    }

    return { allowed: true, message: `${url} is allowed.` };
  }
}
