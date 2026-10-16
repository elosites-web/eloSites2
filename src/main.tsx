/// <reference types="vite/client" />
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

// Registro do Service Worker apenas em ambiente de produção para suporte offline.
// Em ambiente de desenvolvimento, desregistra qualquer SW ativo e limpa caches para evitar
// que módulos do Vite fiquem descompassados na memória do navegador.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (registration.installing) {
            console.debug('[ēloSites SW] Instalando service worker...');
          }
        })
        .catch((err) => {
          console.debug('[ēloSites SW] Erro ao registrar service worker:', err);
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      });
    }
  }
}

