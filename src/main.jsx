import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Add console log for debugging
console.log('🚀 Suno Prompt Website - Main.jsx loaded');
console.log('📍 React version:', React.version);

const rootElement = document.getElementById('root');
console.log('📍 Root element:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ React app rendered successfully');
} else {
  console.error('❌ Root element not found!');
} 