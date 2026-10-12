import React, { useEffect, useRef, useState } from 'react';

export type FlowSceneType = 'hero' | 'processo' | 'cliente' | 'corrente';

interface FlowFrameSequencePlayerProps {
  scene: FlowSceneType;
  title: string;
  subtitle?: string;
  className?: string;
  framesCount?: number;
}

export const FlowFrameSequencePlayer: React.FC<FlowFrameSequencePlayerProps> = ({
  scene,
  title,
  subtitle,
  className = '',
  framesCount = 45,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebPFrames, setHasWebPFrames] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Armazena imagens pré-carregadas caso existam
  const framesCacheRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // Testa se o primeiro frame WebP existe na pasta correspondente
    const testImg = new Image();
    testImg.src = `/assets/flow/${scene}/frame_001.webp`;
    testImg.onload = () => {
      setHasWebPFrames(true);
      // Preload dos demais frames
      const cache: HTMLImageElement[] = [testImg];
      for (let i = 2; i <= framesCount; i++) {
        const img = new Image();
        const padIndex = String(i).padStart(3, '0');
        img.src = `/assets/flow/${scene}/frame_${padIndex}.webp`;
        cache.push(img);
      }
      framesCacheRef.current = cache;
    };
    testImg.onerror = () => {
      // Fallback para renderizador procedural direto no Canvas
      setHasWebPFrames(false);
    };
  }, [scene, framesCount]);

  // Observer de rolagem para amarrar progresso da animação ao scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight || 800;

      // Calcula progresso enquanto o elemento passa pela viewport
      const start = windowH;
      const totalDistance = windowH + (rect.height || 0);
      const current = rect.top;
      const rawProgress = totalDistance > 0 ? (start - current) / totalDistance : 0;
      const clamped = Number.isFinite(rawProgress) ? Math.min(Math.max(rawProgress, 0), 1) : 0;
      setProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loop de desenho no Canvas (WebP frames ou simulação procedural matemática de alta fidelidade)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let localTime = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      localTime += 0.02;

      // Resolução interna nítida para Retina displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height || width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      try {
        // Fundo limpo escuro da marca (#0B0F1A)
        ctx.fillStyle = '#0B0F1A';
        ctx.fillRect(0, 0, width, height);

        // Grid sutil no fundo
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Progresso combinado entre scroll e tempo sutil contínuo
      const rawEffective = (Number.isFinite(progress) ? progress : 0) + (isHovered ? Math.sin(localTime * 2) * 0.1 : 0);
      const effectiveProgress = Number.isFinite(rawEffective) ? Math.min(Math.max(rawEffective, 0), 1) : 0;

      // Caso existam quadros WebP reais, renderiza o quadro correspondente
      if (hasWebPFrames && framesCacheRef.current.length > 0) {
        const frameIndex = Math.min(
          Math.floor(effectiveProgress * framesCacheRef.current.length),
          framesCacheRef.current.length - 1
        );
        const img = framesCacheRef.current[frameIndex];
        if (img && img.complete) {
          ctx.drawImage(img, 0, 0, width, height);
          ctx.restore();
          return;
        }
      }

      // -------------------------------------------------------------
      // RENDERIZADOR PROCEDURAL DAS 4 CENAS DEFINIDAS
      // -------------------------------------------------------------
      const cx = width / 2;
      const cy = height / 2;

      if (scene === 'hero') {
        // CENA 1 (Hero): Dois elos de corrente se aproximando e travando
        // com brilho no encaixe (#6366F1 e #94A3B8)
        const separation = (1 - effectiveProgress) * (width * 0.28);
        const linkW = Math.min(width * 0.32, 140);
        const linkH = linkW * 0.62;

        // Elo Esquerdo (Cinza-Ardósia #94A3B8)
        ctx.save();
        ctx.translate(cx - separation * 0.5 - linkW * 0.2, cy);
        ctx.rotate(-0.15 + effectiveProgress * 0.15);
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#94A3B8';
        ctx.shadowColor = '#94A3B8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(-linkW / 2, -linkH / 2, linkW, linkH, linkH / 2);
        ctx.stroke();
        ctx.restore();

        // Elo Direito (Índigo #6366F1)
        ctx.save();
        ctx.translate(cx + separation * 0.5 + linkW * 0.2, cy);
        ctx.rotate(0.2 - effectiveProgress * 0.2);
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#6366F1';
        ctx.shadowColor = '#6366F1';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(-linkW / 2, -linkH / 2, linkW, linkH, linkH / 2);
        ctx.stroke();
        ctx.restore();

        // Brilho de Encaixe no Ponto de Conexão (Lilás #818CF8)
        const glowAlpha = Math.max(0, 1 - separation / 40);
        if (glowAlpha > 0.05) {
          const radial = ctx.createRadialGradient(cx, cy, 2, cx, cy, 45);
          radial.addColorStop(0, `rgba(129, 140, 248, ${0.9 * glowAlpha})`);
          radial.addColorStop(0.5, `rgba(99, 102, 241, ${0.5 * glowAlpha})`);
          radial.addColorStop(1, 'rgba(11, 15, 26, 0)');
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(cx, cy, 45, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (scene === 'processo') {
        // CENA 2 (Processo / Como Funciona): Blocos de layout flutuam e se
        // encaixam na tela de um smartphone
        const phoneW = Math.min(width * 0.38, 150);
        const phoneH = phoneW * 1.9;

        // Moldura do Smartphone central
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-phoneW / 2, -phoneH / 2, phoneW, phoneH, 20);
        ctx.fill();
        ctx.stroke();

        // Notch / Ilha
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.roundRect(-phoneW * 0.2, -phoneH / 2 + 6, phoneW * 0.4, 8, 4);
        ctx.fill();

        // Blocos de UI se encaixando com o scroll
        // Bloco 1: Header bar
        const headerFly = (1 - Math.min(effectiveProgress * 2.5, 1)) * 50;
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.roundRect(
          -phoneW / 2 + 10,
          -phoneH / 2 + 24 - headerFly,
          phoneW - 20,
          16,
          4
        );
        ctx.fill();

        // Bloco 2: Hero card
        const heroFly = (1 - Math.min(Math.max((effectiveProgress - 0.2) * 2.5, 0), 1)) * 60;
        ctx.fillStyle = '#312e81';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(
          -phoneW / 2 + 10,
          -phoneH / 2 + 46 - heroFly,
          phoneW - 20,
          phoneH * 0.28,
          6
        );
        ctx.fill();
        ctx.stroke();

        // Bloco 3: Botão de ação (CTA)
        const btnFly = (1 - Math.min(Math.max((effectiveProgress - 0.4) * 2.5, 0), 1)) * 70;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(
          -phoneW / 2 + 18,
          -phoneH / 2 + 52 + phoneH * 0.3 - btnFly,
          phoneW - 36,
          14,
          7
        );
        ctx.fill();

        // Bloco 4: Cards inferiores
        const cardsFly = (1 - Math.min(Math.max((effectiveProgress - 0.6) * 2.5, 0), 1)) * 80;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-phoneW / 2 + 10, phoneH / 2 - 40 + cardsFly, phoneW - 20, 26, 4);
        ctx.fill();

        ctx.restore();
      } else if (scene === 'cliente') {
        // CENA 3 (Cliente / Portfólio / Diferenciais): Fachada de loja e celular
        // ligados por feixe de luz que acende bolha de mensagem no smartphone
        const shopX = cx - width * 0.28;
        const phoneX = cx + width * 0.28;

        // Fachada da Loja
        ctx.save();
        ctx.translate(shopX, cy);
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        // Telhado / Toldo
        ctx.beginPath();
        ctx.moveTo(-36, -10);
        ctx.lineTo(0, -32);
        ctx.lineTo(36, -10);
        ctx.closePath();
        ctx.fillStyle = '#4338ca';
        ctx.fill();
        ctx.stroke();
        // Corpo da loja
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.rect(-30, -10, 60, 48);
        ctx.fill();
        ctx.stroke();
        // Porta iluminada
        ctx.fillStyle = '#818cf8';
        ctx.fillRect(-10, 8, 20, 30);
        ctx.restore();

        // Smartphone do Cliente
        ctx.save();
        ctx.translate(phoneX, cy);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-24, -46, 48, 92, 12);
        ctx.fill();
        ctx.stroke();

        // Bolha de mensagem que acende na tela do celular
        const msgAlpha = Math.min(Math.max((effectiveProgress - 0.5) * 2, 0), 1);
        if (msgAlpha > 0.05) {
          ctx.fillStyle = `rgba(16, 185, 129, ${msgAlpha})`;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(-16, -16, 32, 22, 6);
          ctx.fill();
          // Linhas na bolha
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-10, -10, 20, 2.5);
          ctx.fillRect(-10, -4, 14, 2.5);
        }
        ctx.restore();

        // Feixe de luz viajando da loja até o smartphone
        const beamStartX = shopX + 32;
        const beamEndX = phoneX - 26;
        const beamProgress = Math.min(effectiveProgress * 1.4, 1);
        const currentBeamX = beamStartX + (beamEndX - beamStartX) * beamProgress;

        ctx.save();
        // Linha guia sutil
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(beamStartX, cy);
        ctx.lineTo(beamEndX, cy);
        ctx.stroke();

        // Feixe luminoso ativo
        ctx.setLineDash([]);
        const safeStartX = Number.isFinite(beamStartX) ? beamStartX : 0;
        const safeEndX = Number.isFinite(currentBeamX) ? currentBeamX : safeStartX + 1;
        const safeCy = Number.isFinite(cy) ? cy : 0;
        const diffX = Math.abs(safeEndX - safeStartX);
        const finalEndX = diffX < 0.5 ? safeStartX + 1 : safeEndX;

        const beamGrad = ctx.createLinearGradient(safeStartX, safeCy, finalEndX, safeCy);
        beamGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        beamGrad.addColorStop(1, '#818cf8');
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(safeStartX, safeCy);
        ctx.lineTo(finalEndX, safeCy);
        ctx.stroke();

        // Ponto de luz frontal
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(finalEndX, safeCy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (scene === 'corrente') {
        // CENA 4 (CTA Final / Próximo Passo): Corrente completa iluminando elo por elo
        const linksTotal = 5;
        const startX = cx - (linksTotal * 26);
        const linkW = 54;
        const linkH = 32;

        for (let i = 0; i < linksTotal; i++) {
          const lx = startX + i * 44;
          const isLit = effectiveProgress >= i / linksTotal;
          const strokeColor = isLit
            ? i % 2 === 0
              ? '#818CF8'
              : '#6366F1'
            : '#334155';

          ctx.save();
          ctx.translate(lx, cy);
          ctx.lineWidth = 10;
          ctx.strokeStyle = strokeColor;
          if (isLit) {
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 16;
          }
          ctx.beginPath();
          ctx.roundRect(-linkW / 2, -linkH / 2, linkW, linkH, linkH / 2);
          ctx.stroke();

          // Nó de união luminoso quando aceso
          if (isLit && i < linksTotal - 1) {
            ctx.fillStyle = '#c7d2fe';
            ctx.shadowColor = '#818cf8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(linkW / 2 - 4, 0, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
      } catch (err) {
        // Fallback gracioso para evitar travar o React
        console.warn('Canvas render error gracefully caught:', err);
      } finally {
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [scene, progress, isHovered, hasWebPFrames]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0B0F1A] shadow-2xl transition-all duration-300 hover:border-indigo-500/50 group ${className}`}
    >
      {/* Canvas interativo de renderização */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
        style={{ minHeight: '220px' }}
      />

      {/* Badge Superior com status */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-[11px] font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <span>3D Scroll Motion</span>
      </div>

      {/* Legenda Inferior de Acompanhamento */}
      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
        <div>
          <span className="block text-xs font-semibold text-white tracking-wide">{title}</span>
          {subtitle && <span className="block text-[10px] text-slate-400">{subtitle}</span>}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-indigo-300">
          <span>{Math.round(progress * 100)}%</span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
