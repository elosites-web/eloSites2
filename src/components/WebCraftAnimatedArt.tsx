import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Code2, Globe2, Layers, ArrowRight } from 'lucide-react';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';

interface WebCraftAnimatedArtProps {
  compact?: boolean;
  className?: string;
  onActionClick?: () => void;
}

export const WebCraftAnimatedArt: React.FC<WebCraftAnimatedArtProps> = ({
  compact = false,
  className = '',
  onActionClick,
}) => {
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  if (compact) {
    // Versão otimizada e centralizada para o 8º slot do menu de navegação (após Tela 7 / FAQ)
    return (
      <div
        className={`relative w-full h-full min-h-[148px] rounded-2xl border border-indigo-500/35 bg-gradient-to-b from-indigo-950/70 via-[#0B101D] to-slate-950 p-4 sm:p-5 flex flex-col items-center justify-between text-center overflow-hidden shadow-[0_0_24px_rgba(99,102,241,0.2)] hover:shadow-[0_0_36px_rgba(99,102,241,0.4)] hover:border-indigo-400/70 transition-all duration-300 group select-none ${className}`}
      >
        {/* Glows de fundo animados */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/15 blur-2xl rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"
          aria-hidden="true"
        />

        {/* Topo Centralizado: Badge e Ícone */}
        <div className="flex items-center justify-center gap-2 w-full relative z-10">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ēloSites Craft
          </span>
          <span className="text-[10px] uppercase font-mono text-cyan-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" aria-hidden="true" />
            Arte & Código
          </span>
        </div>

        {/* Centro: Arte do Nanobanana + Logo Favicon ēloSites com animação leve de levitação */}
        <div className="relative my-3 flex flex-col items-center justify-center w-full z-10">
          <motion.div
            animate={
              prefersReduced
                ? {}
                : {
                    y: [-2, 2, -2],
                    rotate: [-0.5, 0.5, -0.5],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-28 h-24 sm:w-32 sm:h-26 rounded-xl overflow-hidden border border-indigo-500/35 shadow-lg shadow-indigo-950/60 bg-black/70 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all duration-500 flex items-center justify-center"
          >
            {/* Arte do Nanobanana */}
            <img
              src="/web-craft-art.jpg"
              alt="Arte digital animada de criação de sites profissionais e código"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Overlay sutil de gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D]/80 via-transparent to-transparent pointer-events-none" />

            {/* Linha de varredura holográfica */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
              aria-hidden="true"
            />

            {/* Favicon da ēloSites integrado como selo no canto inferior */}
            <div
              className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-slate-950/90 border border-indigo-400/40 p-0.5 flex items-center justify-center shadow-md backdrop-blur-xs"
              title="ēloSites"
            >
              <img
                src="/favicon.ico"
                alt="Logo favicon ēloSites"
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-elosites-final.png';
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Informações e Chamada Centralizadas */}
        <div className="relative z-10 w-full flex flex-col items-center space-y-1">
          <h3 className="text-xs sm:text-sm font-bold font-display text-white group-hover:text-cyan-200 transition-colors">
            Criação de Sites Sob Medida
          </h3>
          <p className="text-[11px] text-slate-400 leading-snug line-clamp-none max-w-[220px]">
            Design autoral, SEO e alta performance
          </p>

          <a
            href={whatsappUrl(SITE_CONFIG.heroWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (onActionClick) onActionClick();
            }}
            className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/70 hover:text-white transition-all shadow-sm cursor-pointer group-hover:border-emerald-400"
          >
            <span>Iniciar Projeto</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    );
  }

  // Versão expandida centralizada (para inserção na página após o FAQ)
  return (
    <div className={`relative max-w-4xl mx-auto my-12 px-4 select-none ${className}`}>
      <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/50 via-[#0B101D] to-slate-950 p-6 sm:p-8 md:p-10 text-center shadow-2xl shadow-indigo-950/40 overflow-hidden">
        {/* Glow ambiente de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Kicker Centralizado */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold uppercase mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>ēloSites Craft & Engenharia Web</span>
        </div>

        {/* Título & Subtítulo */}
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance mb-4">
          Cada site é desenhado como uma peça exclusiva de engenharia
        </h3>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Unimos estratégia visual, arquitetura semântica para o Google e código leve para criar uma presença digital moderna que converte visitantes em clientes reais.
        </p>

        {/* Arte Centralizada Animada com Badges em Órbita */}
        <div className="relative flex items-center justify-center my-6">
          <motion.div
            animate={
              prefersReduced
                ? {}
                : {
                    y: [-4, 4, -4],
                    rotate: [-0.5, 0.5, -0.5],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border border-indigo-400/40 shadow-2xl shadow-indigo-950/80 bg-black/80"
          >
            <img
              src="/web-craft-art.jpg"
              alt="Arte digital animada de criação de sites profissionais"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/70 via-transparent to-transparent pointer-events-none" />

            {/* Selo do Favicon ēloSites no centro inferior */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 border border-indigo-400/40 shadow-lg backdrop-blur-xs">
              <img
                src="/favicon.ico"
                alt="Favicon ēloSites"
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-elosites-final.png';
                }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-200">ēloSites</span>
            </div>
          </motion.div>

          {/* Micro badges laterais com contexto de criação de sites */}
          <div className="hidden sm:flex absolute -left-2 top-1/4 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-xs">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Código Limpo</span>
          </div>

          <div className="hidden sm:flex absolute -right-2 top-1/3 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-xs">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SEO Técnico</span>
          </div>

          <div className="hidden sm:flex absolute right-10 bottom-2 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Design Autoral</span>
          </div>
        </div>

        {/* Rodapé da Arte com CTA Direto */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl(SITE_CONFIG.heroWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>Falar com o Especialista no WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
