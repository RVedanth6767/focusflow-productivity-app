# Branch Management Guide for FocusFlow Productivity App

As a senior DevOps engineer, this guide covers managing multiple branches in VS Code with GitHub integration.

## 1. Best Practices for Branch Naming and Workflow (Git Flow Inspired)
- **Naming conventions**:
  | Type     | Prefix    | Example                  | Purpose |
  |----------|-----------|--------------------------|---------|
  | Feature  | `feature/`| `feature/user-auth`     | New features |
  | Bugfix   | `bugfix/` | `bugfix/login-crash`    | Bug fixes |
  | Release  | `release/`| `release/v1.2.0`        | Prepare releases |
  | Hotfix   | `hotfix/` | `hotfix/security-patch` | Urgent production fixes |
  | Develop  | `develop` | `develop`               | Integration branch |
- **Workflow**: `main` (production) ← `develop` (staging/integration) ← `feature/bugfix` branches. Always branch from latest `main` or `develop`. Use PRs on GitHub for reviews.
- **General rules**:
  - Keep branches short-lived (<1 week).
  - Commit often with semantic messages: `feat: add login`, `fix: resolve crash`.
  - Rebase before merging to keep history linear.
  - Use `.gitignore` for node_modules, .env, etc.

## 2. Creating Multiple Branches from Main
**Terminal Commands** (from `main`):
```
git checkout main
git pull origin main  # Sync latest
git checkout -b feature/user-auth
git checkout -b bugfix/login-crash
git checkout -b develop  # If it doesn't exist
```
**VS Code UI**:
1. Source Control view (Ctrl+Shift+G) > ... (three dots) > **Branch > Create Branch**.
2. Enter name (e.g., `feature/user-auth`), select base (main).
3. Repeat for others. New branch appears in status bar (bottom-left).

## 3. Switching Between Branches in VS Code Terminal
**Terminal Commands**:
```
git checkout feature/user-auth
git checkout bugfix/login-crash
git checkout main
git checkout develop
```
**VS Code UI** (faster):
1. Bottom-left status bar: Click current branch name.
2. Select from list or **Create new branch**.
3. Or: Source Control > ... > **Branch > Checkout to**.

## 4. Pushing Each Branch to GitHub
**Terminal Commands** (for each branch):
```
git checkout feature/user-auth
git push -u origin feature/user-auth  # -u sets upstream
git checkout bugfix/login-crash
git push -u origin bugfix/login-crash
```
**VS Code UI**:
1. Switch to branch (status bar).
2. Make a commit (Source Control > Stage > Commit).
3. Source Control > ... > **Publish Branch** (auto-pushes and sets upstream).

Branches now visible on GitHub repo page under \"Branches\" tab.

## 5. Pulling Updates from Other Branches
**Terminal Commands** (to pull from remote or another local branch):
```
git checkout develop
git pull origin develop  # From remote
git checkout feature/user-auth
git checkout develop
git pull origin develop
git checkout -b feature/user-auth  # Re-create if needed
git merge develop  # Or rebase: git rebase develop
```
**VS Code UI**:
1. Source Control > ... > **Pull** (syncs current branch with remote).
2. For local: Terminal > `git merge <branch>` or UI merge (step 6).

## 6. Merging Branches Safely (feature → develop → main)
**Safe workflow with PRs** (recommended):
1. GitHub: New PR from `feature/user-auth` → `develop`. Merge via \"Squash and merge\" or \"Rebase and merge\".
2. Local sync: `git checkout develop; git pull origin develop; git checkout main; git pull origin main`.

**Terminal (local merge)**:
```
# Merge feature to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/user-auth  # --no-ff preserves history
git push origin develop

# Merge develop to main (after review)
git checkout main
git pull origin main
git merge --no-ff develop
git push origin main
```
**VS Code UI**:
1. Source Control > ... > **Branch > Merge Branch** > Select source branch.
2. Or use Git Graph extension (install via Extensions view): Visualize > Merge visually.

## 7. Resolving Merge Conflicts in VS Code
**Steps**:
1. Attempt merge: `git merge feature/user-auth` (conflicts arise).
2. VS Code auto-detects: Files show \"C\" (conflicts) in Source Control.
3. Open conflicted file: 
   - **Merge Editor** opens (horizontal/vertical view).
   - Choose \"Accept Current/Incoming/Both\" or edit manually.
   - Green: Current changes \| Blue: Incoming \| Use checkboxes/arrows.
4. Stage resolved files (Source Control > +).
5. Commit: `git commit` (auto-generates message).
6. Push: `git push`.

**Pro Tip**: Install \"GitLens\" extension for blame/history in conflicts.

## 8. Keeping All Branches Synced with Latest Main
**Terminal Script** (run periodically):
```
git checkout main
git pull origin main
git push origin main

for branch in feature/user-auth bugfix/login-crash develop; do
  git checkout $branch
  git rebase main  # Rebase for linear history (safer than merge)
  git push --force-with-lease origin $branch  # Safe force-push
done
git checkout main
```
**VS Code UI**:
- Status bar: Sync (pull/push current).
- GitLens: \"Sync Changes\" per branch.
- Branches view: Right-click > \"Rebase current onto main\".

## 9. Viewing and Managing Branches in VS Code Source Control
- **Source Control view** (Ctrl+Shift+G):
  | Action | Steps |
  |--------|-------|
  | List branches | ... > **Branch > List Branches** |
  | Delete | ... > **Branch > Delete Branch** (local/remote) |
  | Compare | ... > **Branch > Compare with...** |
- **Status Bar**: Branch switcher.
- **Extensions**: 
  1. GitLens (must-have: branch timeline).
  2. Git Graph (visual graph).
- **Command Palette** (Ctrl+Shift+P): \"Git: Checkout\", \"Git: Create Branch\".

## Quick Start Commands (Copy-Paste)
```
# Setup branches
git checkout main &amp;&amp; git pull origin main
git checkout -b develop &amp;&amp; git push -u origin develop
git checkout -b feature/user-auth &amp;&amp; git push -u origin feature/user-auth

# Daily workflow
git pull origin main
git checkout feature/user-auth
# Work, commit...
git commit -m \"feat: add auth\"
git push
```

Generated by BLACKBOXAI for repo: focusflow-productivity-app.

