import React, { useEffect, useRef, useState } from 'react';
import { flowAssetUrl, getFlowManifest, FlowLoopVideo } from '../flowManifest';
import { shouldReduceMedia } from '../mediaPrefs';

interface AmbientLoopVideoProps {
  /** chave em manifest.json > loopVideos (ex.: "hands-viewing", "hands-near") */
  videoKey: string;
}

/**
 * Fundo de seção em vídeo (mudo, loop). Toca só enquanto visível.
 * Movimento reduzido / saveData: só o pôster. Overlay azul-marinho para manter o contraste do texto.
 */
export const AmbientLoopVideo: React.FC<AmbientLoopVideoProps> = ({ videoKey }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cfg, setCfg] = useState<FlowLoopVideo | null>(null);
  const [allowPlayback] = useState(() => !shouldReduceMedia());

  useEffect(() => {
    let cancelled = false;
    getFlowManifest()
      .then((m) => {
        const v = m.loopVideos?.[videoKey];
        if (!cancelled && v) setCfg(v);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [videoKey]);

  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!allowPlayback || !el || !video) return;
    video.muted = true; // exigência de autoplay em alguns navegadores

    const play = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    let inView = false;
    const sync = () => (inView && !document.hidden ? play() : video.pause());

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              inView = Boolean(entries[0]?.isIntersecting);
              sync();
            },
            { threshold: 0.15 }
          )
        : null;
    if (observer) observer.observe(el);
    else {
      inView = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [allowPlayback, cfg]);

  const poster = cfg ? flowAssetUrl(cfg.poster) : undefined;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {cfg && allowPlayback && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
        >
          <source src={flowAssetUrl(cfg.file)} type="video/mp4" />
        </video>
      )}
      {/* overlay azul-marinho (contraste do texto) + tom índigo sutil */}
      <div className="absolute inset-0 bg-[#0B0F1A]/75" />
      <div className="absolute inset-0 bg-[#6366F1]/15 mix-blend-overlay" />
    </div>
  );
};
