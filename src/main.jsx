import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from '@/App.jsx'
import '@/index.css'

// Expanded debug diagnostics
try {
  console.log('🚀 Suno Prompt Website - Main.jsx loaded');
  console.log('📍 React version:', React.version);
  console.log('🔑 React exported keys:', Object.keys(React).slice(0,50));
  console.log('🔍 typeof React.useLayoutEffect:', typeof React.useLayoutEffect);
} catch (e) {
  console.error('Failed initial React diagnostics', e);
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (ev) => {
    console.error('🌋 Global window error:', ev.message, ev.error);
  });
  window.addEventListener('unhandledrejection', (ev) => {
    console.error('🤯 Unhandled promise rejection:', ev.reason);
  });
}

const rootElement = document.getElementById('root');
console.log('📍 Root element:', rootElement);

function renderApp() {
  try {
    if (!rootElement) {
      console.error('❌ Root element not found!');
      return;
    }
    const r = ReactDOM.createRoot(rootElement);
    console.log('🛠 Root created. Rendering <App /> ...');
    r.render(
      <React.StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.StrictMode>
    );
    console.log('✅ React app rendered successfully');
  } catch (err) {
    console.error('💥 Error during initial render', err);
    const fallback = document.createElement('pre');
    fallback.style.color = 'red';
    fallback.style.padding = '1rem';
    fallback.textContent = 'Render failure: ' + (err?.stack || err);
    document.body.appendChild(fallback);
  }
}

renderApp();