import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
  RotateCw,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  companyOrProject: string;
  category: string;
  projectUrl: string;
  quote: string;
  rating: number;
}

// Avaliações autênticas dos clientes reais da ēloSites (dados estritamente preservados)
export const CLIENT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'jv-salvaia',
    name: 'João Victor Salvaia',
    role: 'Personal Trainer & Consultor Online',
    companyOrProject: 'JV Salvaia Personal Trainer',
    category: 'Landing Page de Alta Conversão',
    projectUrl: 'https://jvsalvaiapersonal.netlify.app',
    quote:
      'Gostei muito do resultado do site! Ficou profissional, moderno e com a identidade do meu trabalho como personal trainer. Agora consigo apresentar melhor meus serviços e transmitir mais confiança para quem está buscando um profissional para acompanhar seus treinos. O resultado ficou muito bom!',
    rating: 5,
  },
  {
    id: 'toledo-seguranca',
    name: 'Jonathan Toledo',
    role: 'Proprietário & Diretor Operacional',
    companyOrProject: 'Toledo Segurança',
    category: 'Site Institucional Corporativo',
    projectUrl: 'https://toledoseguranca.netlify.app/',
    quote:
      'O desenvolvimento do site da Toledo Segurança ficou excelente! O projeto transmitiu a seriedade e o profissionalismo que eu queria passar para os nossos clientes. Ter um site próprio faz diferença na apresentação da empresa e fortalece nossa presença na internet. Fiquei muito satisfeito com o resultado e com o trabalho realizado.',
    rating: 5,
  },
  {
    id: 'duelo-fim-de-ano',
    name: 'Renato Becala',
    role: 'Comissão Organizadora',
    companyOrProject: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'Aplicação Web & Plataforma de Evento',
    projectUrl: 'https://jogodefimdeano.netlify.app',
    quote:
      'A landing page para o nosso evento de fim de ano ficou muito bacana! A proposta era ter uma página que reunisse as principais informações do evento de forma organizada e atrativa, e o resultado atendeu muito bem à ideia. Ficou uma apresentação moderna, prática e com a cara do nosso encontro. Com certeza fez o evento ter uma presença digital ainda mais especial!',
    rating: 5,
  },
];

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};

interface TestimonialsSectionProps {
  onNavigateToServices?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onNavigateToServices,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const testimonials = CLIENT_TESTIMONIALS;
  const total = testimonials.length;

  // Instanciação do plugin Autoplay do Embla (5 segundos de intervalo, pausa suave em hover/interação)
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // Configuração do Embla Carousel com loop infinito e aceleração suave
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      duration: 35,
    },
    prefersReduced ? [] : [autoplayPlugin.current]
  );

  // Detecção de viewport para calibrar ângulos da perspectiva 3D
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sincronização do slide ativo e do estado de reprodução do Autoplay
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = emblaApi.plugins()?.autoplay;
    if (autoplay) {
      setIsPlaying(autoplay.isPlaying());
      const onPlay = () => setIsPlaying(true);
      const onStop = () => setIsPlaying(false);

      emblaApi.on('autoplay:play' as any, onPlay);
      emblaApi.on('autoplay:stop' as any, onStop);

      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
        emblaApi.off('autoplay:play' as any, onPlay);
        emblaApi.off('autoplay:stop' as any, onStop);
      };
    }

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Controles manuais de navegação
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Alternar play/pause do autoplay
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  // Suporte a teclado acessível (setas direcionais esquerda e direita)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  // Cálculo da distância relativa no carrossel circular (-1, 0, 1)
  const getRelativeOffset = (idx: number) => {
    let diff = (idx - selectedIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="testemunhos"
      aria-label="Avaliações de Clientes e Prova Social"
      className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 bg-[#070A12]/40 backdrop-blur-[0.5px] relative border-t border-white/[0.08] overflow-hidden"
    >
      {/* Luzes ambiente de fundo ciano e violeta */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/[0.05] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/[0.06] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10">
        {/* Cabeçalho da Seção com Reveal Suave */}
        <motion.div
          initial={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          whileInView={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: prefersReduced ? 0 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl mx-auto text-center space-y-3.5 mb-8 sm:mb-12"
        >
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Social Proof & Clientes Reais</span>
          </div>

          <SplitLines
            as="h2"
            text="O que dizem os clientes que colocaram o site no ar"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
          />

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Depoimentos autênticos de quem confiou na ēloSites para construir sua presença digital com código profissional, performance máxima e foco em conversão.
          </p>

          {/* Destaque de métricas de confiabilidade */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="font-semibold text-white">5.0 / 5.0</span>
              <span className="text-slate-400">• Avaliação máxima</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-slate-300">Projetos reais entregues no Netlify</span>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            ESTÁGIO EMBLA CAROUSEL COM ROTAÇÃO 3D E ACELERAÇÃO POR GPU
           ========================================================================= */}
        <div
          ref={carouselContainerRef}
          data-testimonials-carousel
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrossel Giratório de Depoimentos"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative max-w-5xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded-2xl"
        >
          {/* Viewport do Embla Carousel com suporte nativo a toque/swipe */}
          <div
            className="overflow-hidden py-4 cursor-grab active:cursor-grabbing"
            ref={emblaRef}
            style={{
              perspective: prefersReduced ? 'none' : '1200px',
              perspectiveOrigin: 'center center',
            }}
          >
            <div
              className="flex -ml-4 sm:-ml-6"
              style={{
                transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
              }}
            >
              {testimonials.map((item, idx) => {
                const offset = getRelativeOffset(idx);
                const isActive = offset === 0;
                const isPrev = offset === -1;
                const isNext = offset === 1;

                // Parâmetros de profundidade, escala e rotação 3D calculados
                let rotateY = 0;
                let scale = 1;
                let opacity = 1;
                let translateZ = 0;

                if (!prefersReduced) {
                  if (isActive) {
                    rotateY = 0;
                    scale = 1;
                    opacity = 1;
                    translateZ = 0;
                  } else if (isPrev) {
                    rotateY = isMobile ? 18 : 26;
                    scale = isMobile ? 0.86 : 0.88;
                    opacity = 0.5;
                    translateZ = isMobile ? -50 : -80;
                  } else if (isNext) {
                    rotateY = isMobile ? -18 : -26;
                    scale = isMobile ? 0.86 : 0.88;
                    opacity = 0.5;
                    translateZ = isMobile ? -50 : -80;
                  } else {
                    scale = 0.82;
                    opacity = 0.3;
                    translateZ = -100;
                  }
                } else {
                  scale = isActive ? 1 : 0.92;
                  opacity = isActive ? 1 : 0.45;
                }

                return (
                  <div
                    key={item.id}
                    className="flex-[0_0_92%] sm:flex-[0_0_82%] md:flex-[0_0_72%] lg:flex-[0_0_68%] min-w-0 pl-4 sm:pl-6"
                    style={{
                      transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
                    }}
                  >
                    {/* Card com aceleração direta na GPU: will-change e backface-visibility */}
                    <div
                      onClick={() => {
                        if (!isActive) scrollTo(idx);
                      }}
                      style={{
                        transform: prefersReduced
                          ? `scale(${scale})`
                          : `scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                        opacity,
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
                        transition: prefersReduced
                          ? 'opacity 0.2s ease, transform 0.2s ease'
                          : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      className={`relative rounded-2xl bracket-panel overflow-hidden [will-change:transform] [backface-visibility:hidden] select-none ${
                        isActive
                          ? 'bg-[#0B101D] border-2 border-cyan-400/40 shadow-[0_12px_36px_-6px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/20 cursor-default'
                          : 'bg-[#090E1A]/85 border border-slate-800/80 hover:border-indigo-400/40 shadow-xl cursor-pointer hover:opacity-75'
                      }`}
                      aria-label={`Depoimento de ${item.name}`}
                    >
                      {/* Brilho no topo do card ativo */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-500/[0.12] via-indigo-500/[0.04] to-transparent"
                          aria-hidden="true"
                        />
                      )}

                      {/* Dica de clique para focar no card lateral */}
                      {!isActive && !prefersReduced && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-cyan-300 text-xs font-semibold shadow-lg">
                            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                            Girar para este depoimento
                          </span>
                        </div>
                      )}

                      <div className="p-5 sm:p-7 md:p-8 space-y-4 sm:space-y-5 relative z-10">
                        {/* Top Bar do Card: Categoria, Validação Real, Estrelas e Contador */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-white/[0.08]">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-400/30 text-indigo-300 text-[11px] font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                              <span>{item.category}</span>
                            </div>

                            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>VERIFICADO</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* 5 Estrelas Douradas */}
                            <div
                              className="flex items-center gap-0.5 text-amber-400"
                              title={`Classificação ${item.rating} de 5 estrelas`}
                            >
                              {[...Array(item.rating)].map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>

                            {/* Contador de Slides */}
                            <div className="font-mono text-[11px] text-cyan-300 px-2 py-0.5 rounded-md bg-slate-900/90 border border-cyan-500/20">
                              0{idx + 1} / 0{total}
                            </div>
                          </div>
                        </div>

                        {/* Citação do Cliente com Formatação e Destaque */}
                        <div className="relative pt-0.5">
                          <Quote className="w-6 h-6 text-cyan-400/30 mb-1.5" aria-hidden="true" />
                          <blockquote className="text-sm sm:text-base text-slate-100 leading-relaxed italic border-l-2 border-indigo-500/30 pl-3">
                            "{item.quote}"
                          </blockquote>
                        </div>

                        {/* Rodapé do Card com Dados do Cliente e Ações Diretas */}
                        <div className="pt-3.5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                          {/* Identidade do Cliente */}
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-600/30 via-indigo-600/30 to-purple-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-200 font-bold font-mono text-sm shadow-inner shrink-0">
                                {getInitials(item.name)}
                              </div>
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-slate-950 rounded-full"
                                aria-hidden="true"
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs text-cyan-300 font-medium truncate">
                                {item.role}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                <span className="text-slate-300">{item.companyOrProject}</span>
                              </p>
                            </div>
                          </div>

                          {/* Botões de Ação do Card */}
                          <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                            {item.projectUrl && (
                              <a
                                href={item.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center text-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition-all font-semibold text-xs shadow-sm cursor-pointer group/link"
                                title={`Ver projeto real de ${item.name} no ar`}
                              >
                                <span className="text-center">Acessar projeto</span>
                                <ExternalLink className="w-3 h-3 text-cyan-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                              </a>
                            )}

                            <a
                              href={whatsappUrl(
                                `Olá! Vi o depoimento de *${item.name}* (${item.companyOrProject}) no site da *ēloSites* e gostaria de solicitar um orçamento para o meu negócio!`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cta-primary inline-flex items-center justify-center text-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:text-emerald-100 transition-all shadow-sm"
                              title="Falar sobre projeto similar no WhatsApp"
                            >
                              <WhatsAppIcon className="w-3 h-3 text-emerald-400" />
                              <span className="text-center">Quero similar</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              CONTROLES DE ROTAÇÃO E NAVEGAÇÃO DO CARROSSEL EMBLA
             ========================================================================= */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-4 px-2">
            {/* Botão Girar para Anterior */}
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Girar para o depoimento anterior"
              className="inline-flex items-center justify-center text-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] hover:border-cyan-400/40 shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-center">Girar Anterior</span>
            </button>

            {/* Indicadores de Paginação e Status de Auto-Rotação */}
            <div className="flex items-center gap-3">
              {/* Botão de pausa/reprodução da rotação automática */}
              {!prefersReduced && (
                <button
                  type="button"
                  onClick={toggleAutoplay}
                  aria-label={isPlaying ? 'Pausar rotação automática' : 'Iniciar rotação automática'}
                  title={isPlaying ? 'Pausar rotação automática' : 'Iniciar rotação automática'}
                  className="p-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              )}

              {/* Indicadores dos slides */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Slides do carrossel">
                {testimonials.map((t, idx) => {
                  const isCurrent = selectedIndex === idx;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Girar para o depoimento de ${t.name}`}
                      onClick={() => scrollTo(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        isCurrent
                          ? 'w-8 h-2 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.7)]'
                          : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Rótulo de auxílio de teclado */}
              <span className="hidden lg:inline text-[11px] font-mono text-slate-400">
                ← / → navegue pelas setas
              </span>
            </div>

            {/* Botão Girar para Próximo */}
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Girar para o próximo depoimento"
              className="inline-flex items-center justify-center text-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] hover:border-cyan-400/40 shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer group"
            >
              <span className="text-center">Girar Próximo</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bloco de Ação Rápida no Rodapé dos Testemunhos */}
        <motion.div
          initial={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
          }
          whileInView={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: prefersReduced ? 0 : 0.45,
            delay: prefersReduced ? 0 : 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="glass-card-interactive surface-card mt-10 p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 max-w-4xl mx-auto shadow-2xl shadow-black/60 bracket-panel"
        >
          <div className="space-y-2 text-left w-full lg:max-w-xl">
            <h4 className="font-display text-base sm:text-lg font-bold text-white">
              Quer um site com essa mesma qualidade para o seu negócio?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fale diretamente com quem vai desenvolver seu site, com prazos claros e condições transparentes.
            </p>
          </div>

          <div className="card-action-cluster flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            {onNavigateToServices && (
              <button
                type="button"
                onClick={onNavigateToServices}
                className="inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-all cursor-pointer"
              >
                <span className="text-center">Ver Serviços & Condições</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-center">Conversar no WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
