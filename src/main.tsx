import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent third-party browser extension scripts (e.g. MetaMask inpage.js) from surfacing errors inside the sandboxed frame
if (typeof window !== 'undefined') {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const msg = String(event.reason?.message ?? event.reason ?? '');
      const stack = String(event.reason?.stack ?? '');
      if (msg.includes('MetaMask') || stack.includes('chrome-extension://')) {
        event.preventDefault();
      }
    },
    true
  );
  window.addEventListener(
    'error',
    (event) => {
      const msg = String(event.message ?? '');
      const file = String(event.filename ?? '');
      if (msg.includes('MetaMask') || file.startsWith('chrome-extension://')) {
        event.preventDefault();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(<App />);
