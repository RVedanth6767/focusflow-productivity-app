const SESSION_STORAGE_KEY = 'focusflow.sessions';

const readSessions = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeSessions = (sessions) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
};

const isSameDay = (a, b) => a.toDateString() === b.toDateString();

/**
 * SessionTracker handles persisted focus-session analytics.
 */
export class SessionTracker {
  getSessions() {
    return readSessions();
  }

  addCompletedFocusSession(durationMinutes, associatedTaskIds = []) {
    const sessions = readSessions();
    const entry = {
      id: crypto.randomUUID(),
      type: 'focus',
      durationMinutes,
      completedAt: new Date().toISOString(),
      taskIds: associatedTaskIds,
    };

    sessions.push(entry);
    writeSessions(sessions);
    return entry;
  }

  getAnalytics() {
    const sessions = readSessions().filter((item) => item.type === 'focus');
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const dailyFocusTime = sessions
      .filter((session) => isSameDay(new Date(session.completedAt), now))
      .reduce((total, session) => total + session.durationMinutes, 0);

    const weeklyFocusTime = sessions
      .filter((session) => new Date(session.completedAt) >= weekAgo)
      .reduce((total, session) => total + session.durationMinutes, 0);

    return {
      completedSessions: sessions.length,
      dailyFocusTime,
      weeklyFocusTime,
    };
  }
}
