import { useEffect } from 'react';
import { getMotionTier } from '../mediaPrefs';

/**
 * Controlador dos efeitos exclusivos do tier 'full':
 * - Holofote que segue o ponteiro sobre elementos com a classe `.spotlight`
 *   (delegação de evento, atualização agendada em rAF).
 * - Marca `<html>` com `.motion-full` para ligar borda giratória e marquee,
 *   e `.motion-hidden` quando a aba está oculta (pausa tudo).
 * - Pausa (`.is-paused`) elementos animados que saem da viewport.
 * Não roda nada fora do tier 'full', nem em abas ocultas.
 */
export const PointerSpotlight: React.FC = () => {
  useEffect(() => {
    if (getMotionTier() !== 'full') return;

    const root = document.documentElement;
    root.classList.add('motion-full');

    let raf = 0;
    let last: { el: HTMLElement; x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!last) return;
      const rect = last.el.getBoundingClientRect();
      last.el.style.setProperty('--mx', `${last.x - rect.left}px`);
      last.el.style.setProperty('--my', `${last.y - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('.spotlight') ?? null;
      if (!el) {
        last = null;
        return;
      }
      last = { el, x: event.clientX, y: event.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onVisibility = () => {
      root.classList.toggle('motion-hidden', document.hidden);
    };

    // Pausa animações contínuas que saem da viewport (borda giratória/marquee).
    const toggles = new Map<Element, () => void>();
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            for (const entry of entries) {
              const el = entry.target as HTMLElement;
              el.classList.toggle('is-paused', !entry.isIntersecting);
            }
          })
        : null;

    const scan = () => {
      if (!observer) return;
      document.querySelectorAll<HTMLElement>('.featured-border, .audience-marquee').forEach((el) => {
        if (toggles.has(el)) return;
        observer.observe(el);
        toggles.set(el, () => observer.unobserve(el));
      });
    };

    scan();
    const mutations =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => scan())
        : null;
    mutations?.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      mutations?.disconnect();
      root.classList.remove('motion-full', 'motion-hidden');
    };
  }, []);

  return null;
};
