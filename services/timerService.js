export const FOCUS_DURATION_SECONDS = 25 * 60;
export const BREAK_DURATION_SECONDS = 5 * 60;

/**
 * TimerService encapsulates pomodoro timer transitions/state.
 */
export class TimerService {
  constructor({ onTick, onModeChange, onSessionComplete }) {
    this.onTick = onTick;
    this.onModeChange = onModeChange;
    this.onSessionComplete = onSessionComplete;

    this.state = {
      mode: 'focus',
      remainingSeconds: FOCUS_DURATION_SECONDS,
      isRunning: false,
    };

    this.intervalId = null;
  }

  getState() {
    return { ...this.state };
  }

  start() {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.onTick?.(this.getState());
  }

  pause() {
    this.state.isRunning = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.onTick?.(this.getState());
  }

  reset() {
    this.pause();
    this.state.mode = 'focus';
    this.state.remainingSeconds = FOCUS_DURATION_SECONDS;
    this.onModeChange?.(this.getState());
    this.onTick?.(this.getState());
  }

  tick() {
    if (!this.state.isRunning) return;

    if (this.state.remainingSeconds > 0) {
      this.state.remainingSeconds -= 1;
      this.onTick?.(this.getState());
      return;
    }

    const completedMode = this.state.mode;
    this.state.mode = completedMode === 'focus' ? 'break' : 'focus';
    this.state.remainingSeconds =
      this.state.mode === 'focus' ? FOCUS_DURATION_SECONDS : BREAK_DURATION_SECONDS;

    this.onSessionComplete?.(completedMode);
    this.onModeChange?.(this.getState());
    this.onTick?.(this.getState());
  }
}
