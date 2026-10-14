import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    companyOrProject: 'Toledo Segurança & Vigilância',
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

interface TestimonialsSectionProps {
  onNavigateToServices?: () => void;
  onNavigateToOrcamento?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onNavigateToServices,
  onNavigateToOrcamento,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

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

  // Suporte a teclado acessível quando em foco
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Rotação suave do carrossel (pausada ao passar o mouse ou focar)
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

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  };

  return (
    <section
      id="testemunhos"
      aria-label="Avaliações de Clientes e Prova Social"
      className="py-16 sm:py-24 bg-[#070A12] relative border-t border-white/[0.08] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Luzes ambiente de fundo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/[0.06] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>Social Proof & Avaliações Reais</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            O que dizem os clientes que colocaram o site no ar
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Depoimentos autênticos de quem confiou na ēloSites para construir sua presença digital profissional com código sob medida e foco em conversão.
          </p>

          {/* Destaque de métricas de confiabilidade */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span className="text-slate-300">Projetos reais entregues no Netlify</span>
            </div>
          </div>
        </div>

        {/* Carrossel de Testemunhos */}
        <div
          className="relative max-w-4xl mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrossel de Depoimentos"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Principal */}
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/35 via-purple-500/20 to-white/[0.06] shadow-2xl shadow-indigo-950/40">
            <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#0B101D]/95 backdrop-blur-xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Top Bar do Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>{current.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Classificação com 5 estrelas */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(current.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" aria-hidden="true" />
                        ))}
                      </div>

                      {/* Contador de slides */}
                      <div className="font-mono text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/[0.06]">
                        0{currentIndex + 1} / 0{testimonials.length}
                      </div>
                    </div>
                  </div>

                  {/* Citação do Cliente */}
                  <div className="relative">
                    <Quote className="w-10 h-10 text-indigo-400/30 mb-3" aria-hidden="true" />
                    <blockquote className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal leading-relaxed italic">
                      "{current.quote}"
                    </blockquote>
                  </div>

                  {/* Rodapé do Card com Dados do Cliente e Link para o Site */}
                  <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-200 font-bold font-mono text-base shadow-inner shrink-0">
                        {getInitials(current.name)}
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                          {current.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                          {current.role}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Empresa / Projeto: <span className="text-slate-300">{current.companyOrProject}</span>
                        </p>
                      </div>
                    </div>

                    {/* Botão para visitar o projeto real no ar */}
                    {current.projectUrl && (
                      <a
                        href={current.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.1] hover:border-indigo-400/40 transition-all font-semibold text-xs sm:text-sm shrink-0 shadow-md group cursor-pointer"
                      >
                        <span className="text-center">Acessar projeto no ar</span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controles de Navegação do Carrossel */}
          <div className="mt-8 flex items-center justify-between gap-4">
            {/* Botão Anterior */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="inline-flex items-center justify-center text-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-lg hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline text-center">Anterior</span>
            </button>

            {/* Indicadores de Paginação / Pontos */}
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Slides do carrossel">
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
                      ? 'w-8 h-2.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                      : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Botão Próximo */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="inline-flex items-center justify-center text-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-lg hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
            >
              <span className="hidden sm:inline text-center">Próximo</span>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* Bloco de Ação Rápida no Rodapé dos Testemunhos */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-display text-base sm:text-lg font-bold text-white">
                Quer um site com essa mesma qualidade para o seu negócio?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Fale diretamente com quem vai desenvolver seu site, com prazos claros e condições transparentes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
              {onNavigateToServices && (
                <button
                  type="button"
                  onClick={onNavigateToServices}
                  className="inline-flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-all cursor-pointer"
                >
                  <span className="text-center">Ver Serviços & Condições</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <a
                href={whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary inline-flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
                <span className="text-center">Conversar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
