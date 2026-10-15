import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
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

// Avaliações autênticas dos clientes reais da ēloSites
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

interface TestimonialCardContentProps {
  item: TestimonialItem;
  currentIndex: number;
  totalCount: number;
  direction: number;
  prefersReduced: boolean;
}

const TestimonialCardContent: React.FC<TestimonialCardContentProps> = React.memo(
  ({ item, currentIndex, totalCount, direction, prefersReduced }) => {
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={item.id}
          custom={direction}
          initial={{ opacity: 0, x: prefersReduced ? 0 : direction > 0 ? 14 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: prefersReduced ? 0 : direction > 0 ? -14 : 14 }}
          transition={{ duration: prefersReduced ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Top Bar do Card: Categoria, Estrelas e Contador */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-white/[0.08]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-400/30 text-indigo-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{item.category}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Classificação com 5 estrelas */}
              <div className="flex items-center gap-0.5 text-amber-400" title={`Classificação ${item.rating} de 5 estrelas`}>
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                ))}
              </div>

              {/* Contador de slides */}
              <div className="font-mono text-[11px] text-slate-400 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/[0.06]">
                0{currentIndex + 1} / 0{totalCount}
              </div>
            </div>
          </div>

          {/* Citação do Cliente com Formatação Otimizada */}
          <div className="relative pt-0.5">
            <Quote className="w-6 h-6 text-indigo-400/25 mb-1.5" aria-hidden="true" />
            <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
              "{item.quote}"
            </blockquote>
          </div>

          {/* Rodapé do Card com Dados do Cliente e Links Rápidos */}
          <div className="pt-3.5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-200 font-bold font-mono text-sm shadow-inner shrink-0">
                {getInitials(item.name)}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-indigo-300 font-medium truncate">
                  {item.role}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  <span className="text-slate-300">{item.companyOrProject}</span>
                </p>
              </div>
            </div>

            {/* Ações do Card: Link direto para o projeto e WhatsApp */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
              {item.projectUrl && (
                <a
                  href={item.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.1] hover:border-indigo-400/40 transition-all font-semibold text-xs shadow-sm cursor-pointer group/link"
                  title={`Ver projeto real de ${item.name} no ar`}
                >
                  <span className="text-center">Acessar projeto</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              )}

              <a
                href={whatsappUrl(
                  `Olá! Vi o depoimento de *${item.name}* (${item.companyOrProject}) no site da *ēloSites* e gostaria de solicitar um orçamento para o meu negócio!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                title="Falar sobre projeto similar"
              >
                <WhatsAppIcon className="w-3 h-3 text-emerald-400" />
                <span className="text-center">Quero similar</span>
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);
TestimonialCardContent.displayName = 'TestimonialCardContent';

interface TestimonialsSectionProps {
  onNavigateToServices?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onNavigateToServices,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const testimonials = CLIENT_TESTIMONIALS;
  const current = testimonials[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Suporte a teclado acessível quando o foco está dentro do carrossel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        handleNext();
      }
    };

    carousel.addEventListener('keydown', handleKeyDown);
    return () => carousel.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Rotação automática suave do carrossel com pausa em interação
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  // Suporte a gestos touch (swipe) em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="testemunhos"
      aria-label="Avaliações de Clientes e Prova Social"
      className="py-12 sm:py-20 bg-[#070A12]/30 backdrop-blur-[0.5px] relative border-t border-white/[0.08] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Luzes ambiente de fundo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/[0.06] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10">
        {/* Cabeçalho da Seção com Reveal Suave */}
        <motion.div
          initial={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 22 }
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
          className="max-w-3xl mx-auto text-center space-y-3.5 mb-8 sm:mb-10"
        >
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>Social Proof & Avaliações Reais</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            O que dizem os clientes que colocaram o site no ar
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Depoimentos autênticos de quem confiou na ēloSites para construir sua presença digital profissional com código sob medida e foco em conversão.
          </p>

          {/* Destaque de métricas de confiabilidade */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-white/[0.06]">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="font-semibold text-white">5.0 / 5.0</span>
              <span className="text-slate-400">• Avaliações máximas</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-white/[0.06]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-slate-300">Projetos reais entregues no Netlify</span>
            </div>
          </div>
        </motion.div>

        {/* CARROSSEL INTERATIVO DE TESTEMUNHOS (OTIMIZADO E COMPACTO) */}
        <motion.div
          ref={carouselRef}
          data-testimonials-carousel
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
          className="relative max-w-2xl sm:max-w-3xl mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrossel de Depoimentos"
          tabIndex={0}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Principal Compacto & Otimizado */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-indigo-500/35 via-purple-500/20 to-white/[0.06] shadow-xl shadow-indigo-950/30">
            <div className="rounded-2xl p-5 sm:p-7 md:p-8 bg-[#0B101D]/95 backdrop-blur-xl">
              <TestimonialCardContent
                item={current}
                currentIndex={currentIndex}
                totalCount={testimonials.length}
                direction={direction}
                prefersReduced={prefersReduced}
              />
            </div>
          </div>

          {/* Controles de Navegação do Carrossel */}
          <div className="mt-5 flex items-center justify-between gap-4">
            {/* Botão Anterior */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="inline-flex items-center justify-center text-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline text-center">Anterior</span>
            </button>

            {/* Indicadores de Paginação / Pontos */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Slides do carrossel">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={currentIndex === idx}
                  aria-label={`Ir para avaliação de ${t.name}`}
                  onClick={() => goToIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 h-2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]'
                      : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Botão Próximo */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="inline-flex items-center justify-center text-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
            >
              <span className="hidden sm:inline text-center">Próximo</span>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </motion.div>

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
          className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-5 max-w-4xl mx-auto"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-sm sm:text-base font-bold text-white">
              Quer um site com essa mesma qualidade para o seu negócio?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Fale diretamente com quem vai desenvolver seu site, com prazos claros e condições transparentes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            {onNavigateToServices && (
              <button
                type="button"
                onClick={onNavigateToServices}
                className="inline-flex items-center justify-center text-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-all cursor-pointer"
              >
                <span className="text-center">Ver Serviços & Condições</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center justify-center text-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
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
