import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia, getMotionTier } from '../mediaPrefs';
import { ArrowDown, CheckCircle2, Code2, Smartphone } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';

interface HeroProps {
  mode?: 'home' | 'inicio' | 'all';
  onNavigateToPortfolio?: () => void;
  onNavigateToServices?: () => void;
  isMenuOpen?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  mode = 'all',
  onNavigateToPortfolio,
  onNavigateToServices,
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
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  // Faixa deslizante dos segmentos ativa em todos os dispositivos e celulares
  const marquee = !isReduced;

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

  // Efeito de flutuação sutil em sentido contrário ao background 3D
  const [counterDrift, setCounterDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      // Inversão no sentido oposto ao movimento do fundo 3D
      setCounterDrift({
        x: -normX * 10,
        y: -normY * 8,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReduced]);

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
      {/* 1. TELA HOME: Apenas o background 3D em movimento com a logo flutuante da ēloSites e o menu no topo */}
      {(mode === 'home' || mode === 'all') && (
        <section
          id="home"
          className="h-screen min-h-[580px] w-full flex flex-col items-center justify-center relative select-none px-4 overflow-hidden pointer-events-none"
        >
          {/* Logo grande centralizado sobre o fundo 3D flutuando suavemente em sentido contrário do background */}
          <AnimatePresence>
            {!isMenuOpen && (
              <motion.div
                key="hero-main-floating-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isReduced
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: 1,
                        scale: 1,
                        y: [-8 + counterDrift.y, 8 + counterDrift.y, -8 + counterDrift.y],
                        x: [4 + counterDrift.x, -4 + counterDrift.x, 4 + counterDrift.x],
                        rotate: [-0.5, 0.5, -0.5],
                      }
                }
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                transition={{
                  opacity: { duration: 0.45 },
                  scale: { duration: 0.45 },
                  y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                  x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative flex flex-col items-center justify-center pointer-events-auto"
              >
                {/* Brilho decorativo suave em degradê azul-esverdeado */}
                <div className="absolute -inset-10 sm:-inset-16 bg-gradient-to-r from-teal-500/20 via-cyan-500/25 to-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

                <img
                  src="/logo-elosites-final.png"
                  alt="ēloSites"
                  className="h-20 sm:h-28 md:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_0_45px_rgba(34,211,238,0.45)] relative z-10"
                />
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

              {marquee ? (
                <div className="relative overflow-hidden w-full py-1 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
                  <div className="audience-marquee">
                    {[0, 1].map((group) => (
                      <div
                        key={group}
                        className="flex gap-2.5 pr-2.5 shrink-0"
                        aria-hidden={group === 1}
                      >
                        {targetAudiences.map((item) => (
                          <span
                            key={item.name}
                            className="audience-pill group/pill"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} aria-hidden="true" />
                            <span className="text-xs sm:text-[13px] font-semibold text-slate-100 group-hover/pill:text-white transition-colors tracking-tight whitespace-nowrap">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-white/[0.07] border border-white/[0.1] text-indigo-300 group-hover/pill:text-indigo-200 group-hover/pill:border-indigo-400/40 transition-colors uppercase tracking-wider">
                              {item.tag}
                            </span>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                  {targetAudiences.map((item) => (
                    <span
                      key={item.name}
                      className="audience-pill"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} aria-hidden="true" />
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-100 tracking-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-white/[0.07] border border-white/[0.1] text-indigo-300 uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Ações / CTAs */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                id="hero-cta-whatsapp"
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 px-6 py-4 rounded-xl text-base font-semibold text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 group bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                <WhatsAppIcon className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span className="text-center">Solicitar Orçamento</span>
              </a>

              <a
                id="hero-cta-portfolio"
                href="#portfolio"
                onClick={handleScrollToPortfolio}
                className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-colors active:scale-[0.97]"
              >
                <span className="text-center">Ver Modelos no Ar</span>
                <ArrowDown className="w-4 h-4 text-indigo-400" />
              </a>
            </motion.div>

            {/* Micro-credenciais de confiabilidade */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 text-center lg:text-left">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Arquitetura de alta conversão & código limpo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#a855f7]" />
                <span>
                  <strong className="text-[#a855f7] font-medium">SEO técnico</strong> e Schema.org inclusos
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Design exclusivo sem templates genéricos</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Coluna Visual: Painel Estrutural do Processo com Interação 3D */}
          <motion.div
            initial={playSequence ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: playSequence ? 0.5 : 0, delay: playSequence ? 0.08 : 0, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-5"
          >
            <Interactive3DCard maxTilt={2.5}>
              <div className="relative rounded-2xl glass-panel bg-[#0B101D]/75 backdrop-blur-xl border border-white/10 p-1 shadow-2xl shadow-black/60 bracket-panel">
                {/* Barra de título do terminal */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-slate-950/40 backdrop-blur-md rounded-t-xl gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block shadow-sm shadow-rose-500/50" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shadow-sm shadow-amber-500/50" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm shadow-emerald-500/50" />
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 inline-block">
                    ONLINE
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
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-2.5 border border-white/[0.08] text-center">
                        <div className="flex justify-center mb-1 text-emerald-400">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Moderna</span>
                        <span className="text-[10px] text-slate-400">Tecnologia</span>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-2.5 border border-white/[0.08] text-center">
                        <div className="flex justify-center mb-1 text-indigo-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Responsivo</span>
                        <span className="text-[10px] text-slate-400">Mobile First</span>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-md rounded-lg p-1.5 sm:p-2.5 border border-white/[0.08] text-center">
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
      </div>
    </section>
      )}
  </div>
);
};
