# FocusFlow Productivity App

A lightweight, modular productivity web app implementing focus sessions, task management, and analytics.

## Features

- Pomodoro timer (25m focus / 5m break) with start, pause, and reset
- Automatic focus ↔ break transitions
- Task management with High/Medium/Low priority
- Task completion tracking and association with active focus sessions
- Productivity dashboard for completed sessions plus daily/weekly focus minutes
- Basic distraction list with URL checks while focus mode is active
- Local persistence through browser `localStorage`

## Project Structure

```text
components/
  FocusTimer/
  TaskList/
  Dashboard/
services/
  timerService.js
  taskService.js
  distractionService.js
utils/
  sessionTracker.js
```

## Run Locally

Because this app uses ES modules, serve it through a local static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` in your browser.
