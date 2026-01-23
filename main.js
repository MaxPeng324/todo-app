import React from 'react';
import { createRoot } from 'react-dom/client';
import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import './app.js';

// Initialize Vibe Kanban Web Companion
const rootElement = document.getElementById('vibe-kanban-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(React.createElement(VibeKanbanWebCompanion));
}
