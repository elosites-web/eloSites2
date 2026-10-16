import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia, getMotionTier } from '../mediaPrefs';
import { ArrowDown, CheckCircle2, Code2, Smartphone, ChevronDown } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';

interface HeroProps {
  onNavigateToPortfolio?: () => void;
  onNavigateToServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigateToPortfolio,
  onNavigateToServices,
}) => {
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  // Monitora scroll para esmaecer o indicador quando o usuário já estiver explorando a página
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolledPast((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({ top: Math.min(window.innerHeight * 0.75, 550), behavior: 'smooth' });
  };

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
    'Personal Trainers',
    'Advogados',
    'Barbearias & Salões',
    'Esteticistas & Clínicas',
    'Autônomos & Negócios Locais',
  ];

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  // Faixa deslizante dos segmentos: só no tier 'full' (marquee decorativo).
  const [marquee] = useState(() => getMotionTier() === 'full');

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
    <section
      id="inicio"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 overflow-hidden bg-[#070B16]/25 backdrop-blur-[0.5px] lg:min-h-screen lg:flex lg:flex-col lg:justify-between"
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
            <motion.div variants={itemVariants} className="pt-1 w-full text-center lg:text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-2.5 text-center lg:text-left">
                Desenvolvimento sob medida para:
              </span>
              {marquee ? (
                <div className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
                  <div className="audience-marquee">
                    {[0, 1].map((group) => (
                      <div
                        key={group}
                        className="flex gap-2 pr-2 shrink-0"
                        aria-hidden={group === 1}
                      >
                        {targetAudiences.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium whitespace-nowrap"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {targetAudiences.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                    >
                      {item}
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
            <Interactive3DCard maxTilt={5}>
              <div className="relative rounded-2xl bg-[#0B101D] border border-slate-800 p-1 shadow-2xl shadow-black/60 bracket-panel">
                {/* Barra de título do terminal */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800/80 bg-slate-950/60 rounded-t-xl gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 inline-block">
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
                      <div className="mt-2 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-white">✓ Pronto para publicar</span>
                        </div>
                        <span className="text-[11px] text-indigo-300">Produção</span>
                      </div>
                    </div>

                    {/* Destaques estruturais */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/60 text-center">
                        <div className="flex justify-center mb-1 text-emerald-400">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Moderna</span>
                        <span className="text-[10px] text-slate-400">Tecnologia</span>
                      </div>
                      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/60 text-center">
                        <div className="flex justify-center mb-1 text-indigo-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="block text-white font-bold text-xs sm:text-sm">Responsivo</span>
                        <span className="text-[10px] text-slate-400">Mobile First</span>
                      </div>
                      <div className="bg-slate-900/90 rounded-lg p-1.5 sm:p-2.5 border border-slate-800/60 text-center">
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

        {/* Indicador visual sutil de 'scroll' na parte inferior da tela 'Início' */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-16 lg:mt-20 flex justify-center"
        >
          <button
            type="button"
            onClick={handleScrollDown}
            aria-label="Rolar para explorar o conteúdo abaixo da dobra"
            className={`group inline-flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-xl p-2 cursor-pointer ${
              isScrolledPast ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-300 transition-colors">
              Role para explorar
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-indigo-400/60 flex items-start justify-center p-1 transition-colors bg-slate-950/40 backdrop-blur-xs">
              <motion.div
                animate={isReduced ? { y: 0 } : { y: [0, 8, 0] }}
                transition={
                  isReduced
                    ? { duration: 0 }
                    : { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
                }
                className="w-1 h-2 rounded-full bg-indigo-400"
              />
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300 -mt-1 transition-all ${
                isReduced ? '' : 'animate-bounce'
              }`}
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
