import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// self-hosted fonts: same-origin, hashed, no render-blocking third-party CSS
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/space-grotesk/700.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
