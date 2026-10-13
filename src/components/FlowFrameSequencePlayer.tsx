import React, { useEffect, useRef, useState } from 'react';
import { flowAssetUrl, flowFrameUrl, getFlowManifest, FlowScene } from '../flowManifest';
import { shouldReduceMedia } from '../mediaPrefs';

export type FlowSceneType = 'hero' | 'corrente';

interface FlowFrameSequencePlayerProps {
  scene: FlowSceneType;
  title?: string;
  className?: string;
}

const DPR_CAP = 1.5;

type IdleCb = (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void;
const requestIdle = (cb: IdleCb) =>
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(cb as IdleRequestCallback)
    : window.setTimeout(() => cb({ timeRemaining: () => 8, didTimeout: false }), 120);

/**
 * Sequência de frames controlada pelo scroll (vai e volta).
 * - Frames, dimensões e pôster vêm do manifest.json.
 * - Pôster/primeiro frame carregam já; o resto progressivamente em tempo ocioso.
 * - Redesenha só quando o índice do frame muda; pausa fora da tela / aba oculta.
 * - Sem frames, movimento reduzido ou saveData: só o pôster estático.
 */
export const FlowFrameSequencePlayer: React.FC<FlowFrameSequencePlayerProps> = ({
  scene,
  title,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meta, setMeta] = useState<FlowScene | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const reduced = shouldReduceMedia();

    const metaRef: { current: FlowScene | null } = { current: null };
    const frames: Array<HTMLImageElement | undefined> = [];
    let progress = 0;
    let drawnIndex = -1;
    let visible = false;
    let tabHidden = document.hidden;
    let rafId: number | null = null;

    const getFrame = (index: number): HTMLImageElement | undefined => {
      for (let i = index; i >= 0; i--) {
        const img = frames[i];
        if (img && img.complete && img.naturalWidth > 0) return img;
      }
      return undefined;
    };

    const draw = () => {
      rafId = null;
      const canvas = canvasRef.current;
      const m = metaRef.current;
      if (!canvas || !m || frames.length === 0) return;
      if (tabHidden || !visible) return; // pausado; redesenha ao voltar

      const index = Math.round(progress * Math.max(m.frames - 1, 0));
      if (index === drawnIndex) return;

      const img = getFrame(index);
      const ctx = canvas.getContext('2d');
      if (!img || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const bw = Math.round(canvas.clientWidth * dpr);
      const bh = Math.round(canvas.clientHeight * dpr);
      if (!bw || !bh) return;
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }

      // ajuste de cobertura (cover) centralizado: nunca estica a imagem
      const scale = Math.max(bw / img.naturalWidth, bh / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, bw, bh);
      ctx.drawImage(img, (bw - dw) / 2, (bh - dh) / 2, dw, dh);
      drawnIndex = index;
    };

    const scheduleDraw = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(draw);
    };

    const updateProgress = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = vh + rect.height;
      const raw = total > 0 ? (vh - rect.top) / total : 0;
      progress = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
      scheduleDraw();
    };

    const onResize = () => {
      drawnIndex = -1; // força redesenho com o novo tamanho
      updateProgress();
    };
    const onVisibility = () => {
      tabHidden = document.hidden;
      if (!tabHidden) scheduleDraw();
    };

    let observer: IntersectionObserver | null = null;
    const el = containerRef.current;
    if (el && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        if (visible) updateProgress();
      });
      observer.observe(el);
    } else {
      visible = true;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    getFlowManifest()
      .then((manifest) => {
        const m = manifest.scenes?.[scene];
        if (cancelled || !m) return;
        metaRef.current = m;
        setMeta(m);
        setPosterUrl(flowAssetUrl(m.poster));
        if (reduced) return; // só o pôster estático

        // primeiro frame já; se falhar, fica só o pôster
        const first = new Image();
        first.onload = () => {
          if (cancelled) return;
          frames[0] = first;
          updateProgress();
        };
        first.onerror = () => {
          frames.length = 0;
        };
        first.src = flowFrameUrl(scene, 1);

        // restante progressivamente, em tempo ocioso
        let next = 2;
        const step: IdleCb = (deadline) => {
          if (cancelled) return;
          while (next <= m.frames && (deadline.didTimeout || deadline.timeRemaining() > 4)) {
            const frameNo = next++;
            const img = new Image();
            img.onload = () => {
              frames[frameNo - 1] = img;
            };
            img.src = flowFrameUrl(scene, frameNo);
          }
          if (next <= m.frames) requestIdle(step);
        };
        requestIdle(step);
      })
      .catch(() => {
        /* sem manifesto: nada a mostrar além do fundo */
      });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [scene]);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0B0F1A] shadow-2xl ${className}`}
      style={meta ? { aspectRatio: `${meta.width} / ${meta.height}` } : undefined}
    >
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      {title && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-[#0B0F1A]/70 px-3 py-1.5 text-xs font-medium tracking-wide text-slate-200 backdrop-blur-sm">
          {title}
        </div>
      )}
    </div>
  );
};
