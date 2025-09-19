// Performance optimization utilities
import React from 'react';

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy load components
export const lazyLoad = (importFunc) => {
  return React.lazy(importFunc);
};

// Preload route components
export const preloadRoute = (routeName) => {
  switch (routeName) {
    case 'blog':
      return import('../pages/Blog.jsx');
    case 'guide':
      return import('../pages/Guide.jsx');
    case 'generator':
      return import('../pages/Generator.jsx');
    default:
      return Promise.resolve();
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical styles for above-the-fold content */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .navbar { position: fixed; top: 0; width: 100%; z-index: 50; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const prefetchDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];

  prefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical resources
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Monitor Core Web Vitals
export const measureWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Optimize bundle splitting
export const shouldSplitBundle = (id) => {
  // Split vendor libraries
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('react-dom')) {
      return 'react';
    }
    if (id.includes('framer-motion')) {
      return 'animations';
    }
    if (id.includes('@radix-ui')) {
      return 'ui-components';
    }
    return 'vendor';
  }
  
  // Split by feature
  if (id.includes('pages/')) {
    return 'pages';
  }
  if (id.includes('components/ui/')) {
    return 'ui';
  }
  
  return 'main';
};