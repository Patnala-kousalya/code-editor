# Code Editor (React + Vite + Monaco)

Production-ready frontend code editor built with React, Vite, and Monaco Editor. The project keeps a glass-style interface and focuses on editor reliability, keyboard-driven workflows, responsive behavior, and clean component structure.

## Project Description

This app provides a browser-based code editor workspace with:
- Monaco-based editing
- Multi-file tab switching
- Keyboard event tracking
- Command palette shortcuts
- Save status feedback
- Responsive desktop/mobile behavior

## Setup Steps

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. (Optional) create local env file:

```bash
cp .env.example .env
```

## Run Instructions

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview -- --host 0.0.0.0 --port 5173
```

### Docker

Build and run with docker compose:

```bash
docker-compose up --build
```

Open: `http://localhost:5173`

## Features

- Stable Monaco typing and file updates
- `editor.onKeyUp` keyboard event tracking in event debugger panel
- `Ctrl+S` save shortcut with status bar timestamp
- `Ctrl+K` command palette (center overlay)
- `Escape` to close command palette
- Status bar states: `Ready`, `Typing...`, `Saved <time>`
- Tabs: `index.js`, `style.css`, `README.md`
- Internal dark/light theme toggle logic
- Floating AI button UI in bottom-right
- Responsive workspace behavior on smaller screens
- Accessibility improvements (focus-visible, ARIA roles, keyboard tab navigation)
- Component separation:
  - `Editor`
  - `Tabs`
  - `CommandPalette`
  - `StatusBar`

## Environment Variables

See `.env.example`:
- `VITE_APP_NAME`
- `VITE_DEFAULT_THEME`
- `VITE_ENABLE_AI_FAB`

No secret keys are stored in the repository.
