import React, { useEffect, useRef, useState } from 'react';
import { flowAssetUrl, getFlowManifest, FlowLoopVideo } from '../flowManifest';
import { shouldReduceMedia } from '../mediaPrefs';

interface AmbientLoopVideoProps {
  /** chave em manifest.json > loopVideos (ex.: "hands-viewing", "hands-near") */
  videoKey?: string;
  isFixed?: boolean;
  className?: string;
}

/**
 * Fundo de seção ou tela em vídeo (mudo, loop contínuo).
 * Quando isFixed=true, atua como background animado persistente em movimento constante
 * para todas as telas (de 1 a 8).
 * Mantém contraste e legibilidade do texto com overlay profissional azul-marinho/índigo.
 */
export const AmbientLoopVideo: React.FC<AmbientLoopVideoProps> = ({
  videoKey = 'hands-viewing',
  isFixed = false,
  className = '',
}) => {
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
    video.muted = true;

    const play = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    if (isFixed) {
      // No modo fixo global, o vídeo mantém movimento contínuo constante
      play();
      const handleVis = () => {
        if (!document.hidden) play();
        else video.pause();
      };
      document.addEventListener('visibilitychange', handleVis);
      return () => {
        document.removeEventListener('visibilitychange', handleVis);
        video.pause();
      };
    }

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
  }, [allowPlayback, cfg, isFixed]);

  const poster = cfg ? flowAssetUrl(cfg.poster) : undefined;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${
        isFixed ? 'fixed inset-0 z-0' : 'absolute inset-0'
      } ${className}`}
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
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={poster}
        >
          <source src={flowAssetUrl(cfg.file)} type="video/mp4" />
        </video>
      )}
      {/* Overlay com contraste apurado para legibilidade de texto em todas as 8 telas */}
      <div className="absolute inset-0 bg-[#070A14]/78 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[#4F46E5]/12 mix-blend-overlay" />
    </div>
  );
};
