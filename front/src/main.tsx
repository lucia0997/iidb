import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react'; (window as any).React = React;
import "./locales/i18n"

import App from './App';

// Root definition
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found.');
const root = createRoot(rootEl);

// Rendering
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
