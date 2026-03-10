import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('seo-tool-root');

if (container) {

  const shadow = container.attachShadow({ mode: 'open' });

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  const root = createRoot(mountPoint);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}