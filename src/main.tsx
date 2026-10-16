import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './components/Toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);

// Registro do Service Worker para suporte offline e aceleração por cache
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Registrado com sucesso
        if (registration.installing) {
          console.debug('[ēloSites SW] Instalando service worker...');
        }
      })
      .catch((err) => {
        console.debug('[ēloSites SW] Erro ao registrar service worker:', err);
      });
  });
}

