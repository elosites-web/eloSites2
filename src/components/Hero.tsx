import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia, getMotionTier } from '../mediaPrefs';
import { ArrowDown, CheckCircle2, Code2, Smartphone, Zap, Shield, Sparkles } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';
import { MagneticButton } from './MagneticButton';
import { AnimatedCounter } from './AnimatedCounter';
import { InfiniteMarquee } from './InfiniteMarquee';

interface HeroProps {
  mode?: 'home' | 'inicio' | 'all';
  onNavigateToPortfolio?: () => void;
  isMenuOpen?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  mode = 'all',
  onNavigateToPortfolio,
  isMenuOpen = false,
}) => {
  const heroWhatsappUrl = whatsappUrl(SITE_CONFIG.heroWhatsappMessage);

  const handleScrollToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToPortfolio) {
      onNavigateToPortfolio();
    } else {
      const portfolio = document.querySelector('#portfolio');
      if (portfolio) {
        portfolio.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const targetAudiences = [
    { name: 'Personal Trainers & Academias', tag: 'Fitness', dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]' },
    { name: 'Advogados & Escritórios', tag: 'Jurídico', dot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' },
    { name: 'Barbearias & Salões de Beleza', tag: 'Beleza', dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' },
    { name: 'Esteticistas & Clínicas', tag: 'Estética', dot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]' },
    { name: 'Dentistas & Consultórios', tag: 'Saúde', dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' },
    { name: 'Psicólogos & Terapeutas', tag: 'Terapia', dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]' },
    { name: 'Médicos & Nutricionistas', tag: 'Clínica', dot: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' },
    { name: 'Corretores & Imobiliárias', tag: 'Imóveis', dot: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' },
    { name: 'Arquitetos & Engenheiros', tag: 'Projetos', dot: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]' },
    { name: 'Contadores & Consultorias', tag: 'B2B', dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]' },
    { name: 'Veterinários & Pet Shops', tag: 'Pet Care', dot: 'bg-pink-400 shadow-[0_0_8px_#f472b6]' },
    { name: 'Fotógrafos & Estúdios', tag: 'Criativo', dot: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' },
    { name: 'Restaurantes & Gastronomia', tag: 'Food', dot: 'bg-orange-400 shadow-[0_0_8px_#fb923c]' },
    { name: 'Autônomos & Negócios Locais', tag: 'Geral', dot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' },
  ];

  const systemPrefersReduced = useReducedMotion();
  const motionTier = getMotionTier();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || motionTier === 'none');
  const heavyMotion = !isReduced && motionTier === 'full';

  // Sequência de entrada do hero: roda apenas na primeira montagem da sessão
  // (efeito raro = delight). Nas demais navegações o conteúdo já aparece pronto.
  const [playSequence] = useState(() => {
    if (isReduced) return false;
    try {
      if (sessionStorage.getItem('elosites_hero_played') === '1') return false;
      sessionStorage.setItem('elosites_hero_played', '1');
    } catch {
      return true;
    }
    return true;
  });

  // Efeito de flutuação sutil e interativa da logo na Home
  const [counterDrift, setCounterDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!heavyMotion) return;

    let rafId = 0;
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        const { innerWidth, innerHeight } = window;
        const normX = (lastX / innerWidth - 0.5) * 2;
        const normY = (lastY / innerHeight - 0.5) * 2;
        const nextX = normX * 6;
        const nextY = normY * 5;
        setCounterDrift((prev) =>
          Math.abs(prev.x - nextX) < 0.1 && Math.abs(prev.y - nextY) < 0.1
            ? prev
            : { x: nextX, y: nextY }
        );
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heavyMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: playSequence ? 0.08 : 0,
        delayChildren: playSequence ? 0.04 : 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: playSequence ? 12 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: playSequence ? 0.48 : 0,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  return (
    <div className="w-full">
      {/* 1. TELA HOME: Apenas a logo flutuante da ēloSites centralizada sobre o fundo azul marinho estático */}
      {(mode === 'home' || mode === 'all') && (
        <section
          id="home"
          className="hero-home-viewport min-h-[580px] w-full flex flex-col items-center justify-center relative select-none px-4 overflow-hidden pointer-events-none"
        >
          {/* Logo grande centralizado sobre o fundo azul marinho estático */}
          <AnimatePresence>
            {!isMenuOpen && (
              <motion.div
                key="hero-main-floating-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  heavyMotion
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: [-8 + counterDrift.y, 8 + counterDrift.y, -8 + counterDrift.y],
                        x: [4 + counterDrift.x, -4 + counterDrift.x, 4 + counterDrift.x],
                        rotate: [-0.5, 0.5, -0.5],
                      }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                transition={
                  heavyMotion
                    ? {
                        opacity: { duration: 0.45 },
                        scale: { duration: 0.45 },
                        y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                        x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : { opacity: { duration: 0.45 }, scale: { duration: 0.45 } }
                }
                className="relative flex flex-col items-center justify-center pointer-events-auto"
              >
                {/* Brilho decorativo minimalista e suave de acordo com as cores do logo e botão de menu */}
                <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-purple-500/[0.07] via-violet-500/[0.09] to-indigo-500/[0.07] blur-2xl rounded-full pointer-events-none" />

                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = 'home';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl p-2 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                  aria-label="ēloSites — Página Inicial (Home)"
                >
                  <img
                    src="/logo-elosites-1360.png"
                    alt="ēloSites"
                    width={1360}
                    height={337}
                    className="hero-home-logo w-auto object-contain relative z-10"
                  />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 2. TELA INÍCIO: Apresentação Estratégica Completa com Headline, Marquee 90s e CTAs */}
      {(mode === 'inicio' || mode === 'all') && (
        <section
          id="inicio"
          className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 overflow-hidden bg-[#070B16]/25 backdrop-blur-[0.5px]"
        >
        {/* Background subtle tech grid & glow */}
        <div className="absolute inset-0 tech-grid-pattern opacity-70 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna de Conteúdo Principal — Centralizado no mobile (<lg) e alinhado à esquerda no desktop (>=lg) */}
          <motion.div
            variants={containerVariants}
            initial={playSequence ? 'hidden' : false}
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8"
          >
            {/* Tag de Posicionamento */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs sm:text-sm font-medium mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Sites com <span className="text-[#a855f7] font-semibold">SEO Técnico</span> & Foco em Conversão
              </span>
            </motion.div>

            {/* Headline Principal — Grande escala tanto no mobile quanto no desktop */}
            <motion.h1 variants={itemVariants} className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              Criação de sites institucionais e landing pages profissionais sob medida com{' '}
              <span className="text-[#a855f7] underline decoration-[#a855f7]/50 underline-offset-8">
                SEO técnico
              </span>{' '}
              e foco em conversão.
            </motion.h1>

            {/* Subtítulo Direto e Comercial */}
            <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Desenvolvemos a presença digital completa e estratégica para o seu negócio. Sites institucionais
              e landing pages sob medida, com alta velocidade, arquitetura semântica para o Google e estrutura
              otimizada para transformar visitantes em contatos no seu WhatsApp.
            </motion.p>

            {/* Segmentos Atendidos */}
            <motion.div variants={itemVariants} className="pt-2 w-full text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-slate-900/90 border border-indigo-500/25 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  Desenvolvimento sob medida para:
                </span>
              </div>

              {/* Marquee Contínuo de Nichos com Desvanecimento Suave nas Extremidades (10% a 90%) */}
              <div
                className="relative overflow-hidden w-full py-1 touch-pan-y"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
              >
                <div className="niche-marquee">
                  {[0, 1].map((group) => (
                    <div
                      key={group}
                      className="flex gap-2.5 pr-2.5 shrink-0 flex-nowrap"
                      aria-hidden={group === 1}
                    >
                      {targetAudiences.map((item) => (
                        <span
                          key={`${group}-${item.name}`}
                          className="audience-pill group/pill shrink-0"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} aria-hidden="true" />
                          <span className="text-xs sm:text-[13px] font-semibold text-slate-100 group-hover/pill:text-white transition-colors tracking-tight whitespace-nowrap">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-white/[0.07] border border-white/[0.1] text-indigo-300 group-hover/pill:text-indigo-200 group-hover/pill:border-indigo-400/40 transition-colors uppercase tracking-wider whitespace-nowrap">
                            {item.tag}
                          </span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Ações / CTAs com Efeito Magnético */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <MagneticButton
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                strength={12}
                glowColor="rgba(37, 211, 102, 0.4)"
                className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 px-7 py-4 rounded-xl text-base font-semibold text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] transition-all"
                ariaLabel="Solicitar Orçamento no WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span className="text-center font-bold">Solicitar Orçamento</span>
              </MagneticButton>

              <MagneticButton
                href="#portfolio"
                onClick={handleScrollToPortfolio}
                strength={10}
                glowColor="rgba(99, 102, 241, 0.3)"
                className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all active:scale-[0.97]"
                ariaLabel="Ver Modelos no Ar"
              >
                <span className="text-center">Ver Modelos no Ar</span>
                <ArrowDown className="w-4 h-4 text-indigo-400" />
              </MagneticButton>
            </motion.div>

            {/* Micro-credenciais de confiabilidade com contadores dinâmicos */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 text-center lg:text-left">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><AnimatedCounter to={100} suffix="%" /> SEO técnico & Schema.org</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Performance &lt; <AnimatedCounter to={1.2} decimals={1} suffix="s" /> LCP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span><AnimatedCounter to={14} prefix="+" /> nichos especializados</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Coluna Visual: Painel Estrutural do Processo com Interação 3D e Camadas Breakout */}
          <motion.div
            initial={playSequence ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: playSequence ? 0.5 : 0, delay: playSequence ? 0.08 : 0, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-5 breakout-perspective relative"
          >
            {/* Breakout floating chip superior (projetando-se em 3D, reposicionado de forma segura em tablets) */}
            <div
              className="hidden sm:flex absolute -top-3.5 right-1 sm:right-2 md:right-0 lg:-right-3 z-30 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090E1D] border border-cyan-500/40 shadow-xl shadow-cyan-950/60 text-xs font-mono text-cyan-300 pointer-events-none breakout-layer-front backdrop-blur-md max-w-[calc(100%-1rem)]"
              style={{ transform: 'translateZ(36px)' }}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Core Web Vitals 100/100</span>
            </div>

            {/* Breakout floating chip inferior esquerdo (reposicionado de forma segura em tablets) */}
            <div
              className="hidden sm:flex absolute -bottom-3 left-1 sm:left-2 md:left-0 lg:-left-3 z-30 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090E1D] border border-emerald-500/40 shadow-xl shadow-emerald-950/60 text-xs font-mono text-emerald-300 pointer-events-none breakout-layer-front backdrop-blur-md max-w-[calc(100%-1rem)]"
              style={{ transform: 'translateZ(32px)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Indexado com Sucesso</span>
            </div>

            <Interactive3DCard maxTilt={4} animatedBorder={true}>
              <div className="relative rounded-2xl glass-panel bg-[#0B101D]/85 backdrop-blur-xl border border-white/10 p-1 shadow-2xl shadow-black/80 bracket-panel">
                {/* Barra de título do terminal */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-slate-950/60 backdrop-blur-md rounded-t-xl gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block shadow-sm shadow-rose-500/50" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shadow-sm shadow-amber-500/50" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm shadow-emerald-500/50" />
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE &bull; PRONTO
                  </span>
                </div>

                {/* Corpo do Terminal CLI */}
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-3 text-slate-300">
                    <div className="text-slate-400 flex items-center gap-2">
                      <span className="text-indigo-400 font-semibold">$</span>
                      <span>elosites build --focus=conversion</span>
                    </div>

                    <div className="space-y-1.5 pl-3 border-l-2 border-indigo-500/30">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>Estratégia de conteúdo e posicionamento</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>Design sob medida alinhado ao seu nicho</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>Projeto pensado para boa experiência no celular</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>Integração estratégica com WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>Estrutura semântica e código limpo</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-slate-400 flex items-center gap-2">
                        <span className="text-indigo-400 font-semibold">$</span>
                        <span className="text-slate-200">elosites deploy --status=ready</span>
                      </div>
                      <div className="mt-2 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 flex items-center justify-between backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                          <span className="font-semibold text-white">✓ Pronto para publicar</span>
                        </div>
                        <span className="text-[11px] text-indigo-300">Produção</span>
                      </div>
                    </div>

                    {/* Destaques estruturais */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-2.5 border border-white/[0.08] text-center hover:border-cyan-500/40 transition-colors">
                        <div className="flex justify-center mb-1 text-emerald-400">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Moderna</span>
                        <span className="text-[10px] text-slate-400">Tecnologia</span>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-2.5 border border-white/[0.08] text-center hover:border-indigo-500/40 transition-colors">
                        <div className="flex justify-center mb-1 text-indigo-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Responsivo</span>
                        <span className="text-[10px] text-slate-400">Mobile First</span>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-1.5 sm:p-2.5 border border-white/[0.08] text-center hover:border-emerald-500/40 transition-colors">
                        <div className="flex justify-center mb-1 text-emerald-400">
                          <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm whitespace-nowrap">Conversão</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">WhatsApp</span>
                      </div>
                    </div>
                  </div>
              </div>
            </Interactive3DCard>
          </motion.div>
        </div>

        {/* Faixa Marquee de Engenharia & Tecnologias */}
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          <InfiniteMarquee
            items={[
              { text: 'React 19 & TypeScript', icon: <Code2 className="w-3.5 h-3.5" />, badge: 'Core' },
              { text: 'Vite & Tailwind CSS', icon: <Zap className="w-3.5 h-3.5" />, badge: 'High Perf' },
              { text: 'SEO Técnico & Schema.org', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'Rank 1' },
              { text: 'Google Analytics 4 & GTM', icon: <Shield className="w-3.5 h-3.5" />, badge: 'Tracking' },
              { text: '100/100 Core Web Vitals', icon: <Zap className="w-3.5 h-3.5" />, badge: 'PageSpeed' },
              { text: 'Arquitetura Semântica', icon: <Code2 className="w-3.5 h-3.5" />, badge: 'Clean Code' },
              { text: 'Mobile-First Responsivo', icon: <Smartphone className="w-3.5 h-3.5" />, badge: '360px-4K' },
              { text: 'Canal Direto no WhatsApp', icon: <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Leads' },
            ]}
            speed={28}
          />
        </div>
      </div>
    </section>
      )}
  </div>
);
};
