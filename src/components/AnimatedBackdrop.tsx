import React, { useEffect, useState } from 'react';
import { shouldReduceMedia } from '../mediaPrefs';

/**
 * Fundo animado em CSS puro (substitui o antigo vídeo de fundo global).
 * - base escura + grade sutil em deriva + 2–3 brilhos suaves + varredura lenta;
 * - anima apenas `transform` e `opacity` (leve em celulares modestos);
 * - pausa quando a aba fica oculta (`visibilitychange`);
 * - fica estático com `prefers-reduced-motion` ou `saveData` (`shouldReduceMedia()`),
 *   e também via `@media (prefers-reduced-motion: reduce)` no CSS.
 */
export const AnimatedBackdrop: React.FC = () => {
  const [isStatic] = useState(() => shouldReduceMedia());
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isStatic) return;
    const handleVisibility = () => setIsPaused(document.hidden);
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isStatic]);

  return (
    <div
      aria-hidden="true"
      className={`animated-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${
        isStatic ? 'is-static' : ''
      } ${isPaused ? 'is-paused' : ''}`}
    >
      <div className="ab-base absolute inset-0" />
      <div className="ab-grid absolute" />
      <div className="ab-blob ab-blob-cyan" />
      <div className="ab-blob ab-blob-indigo" />
      <div className="ab-blob ab-blob-violet" />
      <div className="ab-scan absolute inset-0" />
      <div className="ab-vignette absolute inset-0" />
    </div>
  );
};
