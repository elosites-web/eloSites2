import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { Persistent3DBackground } from './components/Persistent3DBackground';
import { AnimatedBackdrop } from './components/AnimatedBackdrop';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProcessSection } from './components/ProcessSection';
import { FaqSection } from './components/FaqSection';
import { ContactCtaSection } from './components/ContactCtaSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LegalModals } from './components/LegalModals';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import {
  DifferentialsSkeleton,
  PortfolioSkeleton,
  ServicesSkeleton,
  BookingSkeleton,
} from './components/SectionSkeletons';
import { ScreenId, SCREENS } from './types';
import { shouldReduceMedia } from './mediaPrefs';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

// Code-splitting via React.lazy para acelerar a carga inicial da tela Início
const PortfolioSection = lazy(() =>
  import('./components/PortfolioSection').then((mod) => ({ default: mod.PortfolioSection }))
);
const TestimonialsSection = lazy(() =>
  import('./components/TestimonialsSection').then((mod) => ({ default: mod.TestimonialsSection }))
);
const ServicesSection = lazy(() =>
  import('./components/ServicesSection').then((mod) => ({ default: mod.ServicesSection }))
);
const DifferentialsSection = lazy(() =>
  import('./components/DifferentialsSection').then((mod) => ({ default: mod.DifferentialsSection }))
);
const ProjectBriefBookingSection = lazy(() =>
  import('./components/ProjectBriefBookingSection').then((mod) => ({
    default: mod.ProjectBriefBookingSection,
  }))
);

// Cena 3D persistente carregada de forma assíncrona

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('inicio');
  const [direction, setDirection] = useState<number>(1);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Hook do Framer Motion combinado com a preferência de acessibilidade
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Modo de alto contraste para acessibilidade
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('elosites_contrast') === 'high';
    } catch {
      return false;
    }
  });

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('elosites_contrast', next ? 'high' : 'normal');
      } catch {}
      return next;
    });
  };

  // Sincronização inicial e bidirecional com a hash da URL (7 telas oficiais)
  useEffect(() => {
    const validIds: ScreenId[] = [
      'inicio',
      'portfolio',
      'servicos',
      'processo',
      'diferenciais',
      'orcamento',
      'faq',
    ];

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (validIds.includes(rawHash as ScreenId)) {
        const targetScreen = rawHash as ScreenId;
        setCurrentScreen((prev) => {
          if (prev !== targetScreen) {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === targetScreen);
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return targetScreen;
        });
      } else if (rawHash === 'contato') {
        setCurrentScreen((prev) => {
          if (prev !== 'faq') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'faq');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'faq';
        });
        setTimeout(() => {
          const el = document.getElementById('contato');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (rawHash === 'testemunhos' || rawHash === 'depoimentos' || rawHash === 'social-proof') {
        setCurrentScreen((prev) => {
          if (prev !== 'portfolio') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'portfolio');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'portfolio';
        });
        setTimeout(() => {
          const el = document.getElementById('testemunhos');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    // Lê na carga inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ao trocar de tela, atualiza o hash, a direção do slide lateral e rola para o topo
  const navigateToScreen = (screenId: ScreenId) => {
    const prevIdx = SCREENS.findIndex((s) => s.id === currentScreen);
    const nextIdx = SCREENS.findIndex((s) => s.id === screenId);
    if (nextIdx !== -1 && prevIdx !== -1 && nextIdx !== prevIdx) {
      setDirection(nextIdx > prevIdx ? 1 : -1);
    }
    setCurrentScreen(screenId);
    window.location.hash = screenId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const currentIndex = SCREENS.findIndex((s) => s.id === currentScreen);
  const previousScreen = currentIndex > 0 ? SCREENS[currentIndex - 1] : null;
  const nextScreen = currentIndex < SCREENS.length - 1 ? SCREENS[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (previousScreen) {
      navigateToScreen(previousScreen.id);
    }
  };

  const handleNext = () => {
    if (nextScreen) {
      navigateToScreen(nextScreen.id);
    }
  };

  // Suporte a navegação por setas do teclado (Esquerda e Direita)
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      // Atalhos com modificadores pertencem ao navegador (ex.: Alt+Seta = voltar)
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const targetTag = target.tagName?.toLowerCase();
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
          return;
        }
        if (target.isContentEditable) return;
        // O carrossel de depoimentos trata as setas por conta própria
        if (target.closest('[data-testimonials-carousel]')) return;
      }

      // Não navegar quando um modal/diálogo (legal ou menu) está aberto
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;

      if (e.key === 'ArrowLeft' && previousScreen) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && nextScreen) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [previousScreen, nextScreen]);

  // Sincronização dinâmica de meta tags OpenGraph, Twitter Cards, Canonical e Title para cada seção/tela
  useEffect(() => {
    const meta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];
    const isHome = currentScreen === 'inicio';

    const pageTitle = isHome
      ? 'ēloSites — Criação de Sites Profissionais com SEO Técnico e Conversão'
      : `${meta.title} | ēloSites — Sites Profissionais com SEO Técnico`;

    const pageDesc = isHome
      ? 'Criação de sites profissionais e landing pages com SEO técnico e foco em conversão para pequenos negócios e profissionais liberais. Alta performance e código limpo.'
      : `${meta.description} Desenvolvimento de sites institucionais e landing pages de alta conversão pela ēloSites.`;

    const canonicalUrl = isHome
      ? 'https://elosites.ia.br/'
      : `https://elosites.ia.br/#${currentScreen}`;

    // Atualiza o <title> do documento
    document.title = pageTitle;

    // Helper para atualizar ou criar meta tag
    const updateMeta = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description padrão
    updateMeta('meta[name="description"]', 'name', 'description', pageDesc);

    // Canonical Tag
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // OpenGraph dinâmico
    updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    // Twitter Cards dinâmico
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
    updateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
  }, [currentScreen]);

  const currentMeta = SCREENS[currentIndex] || SCREENS[0];

  // Transição contínua e suave na diagonal em 12px solicitada pelo usuário
  const sectionTransitionVariants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? 12 : -12,
      y: prefersReduced ? 0 : dir >= 0 ? 12 : -12,
    }),
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: prefersReduced ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: prefersReduced ? 0.15 : 0.2,
          ease: 'easeOut',
        },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? -12 : 12,
      y: prefersReduced ? 0 : dir >= 0 ? -12 : 12,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.16,
          ease: 'easeIn',
        },
        y: {
          duration: prefersReduced ? 0 : 0.16,
          ease: 'easeIn',
        },
        opacity: {
          duration: prefersReduced ? 0.12 : 0.15,
          ease: 'easeIn',
        },
      },
    }),
  };

  return (
    <div className={`min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Link de pular para o conteúdo (primeiro elemento focável) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      {/* Região viva: anuncia a tela atual para leitores de tela */}
      <div className="sr-only" role="status" aria-live="polite">
        {`Tela ${currentMeta.number}: ${currentMeta.title}`}
      </div>

      {/* Barra de Progresso de Leitura no Topo */}
      <ReadingProgressBar key={currentScreen} currentScreen={currentScreen} />

      {/* Fundo animado leve em CSS puro (substitui o vídeo global) */}
      <AnimatedBackdrop />

      {/* Cena 3D Persistente procedural no fundo */}
      <Persistent3DBackground />

      {/* Header Fixo com Botão Único "MENU DE NAVEGAÇÃO" */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={navigateToScreen}
        onPreviousScreen={handlePrevious}
        onNextScreen={handleNext}
      />

      {/* Conteúdo Principal — Exibição Estratégica da Tela Ativa com Transição Fluida e Responsiva */}
      <main className="flex-1 relative z-10 overflow-x-hidden" id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={sectionTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {/* TELA 01: Início & Apresentação */}
            {currentScreen === 'inicio' && (
              <Hero
                onNavigateToPortfolio={() => navigateToScreen('portfolio')}
                onNavigateToServices={() => navigateToScreen('servicos')}
              />
            )}

            {/* TELA 02: Portfólio de Projetos Reais & Depoimentos (Social Proof) */}
            {currentScreen === 'portfolio' && (
              <SectionErrorBoundary>
                <Suspense fallback={<PortfolioSkeleton />}>
                  <PortfolioSection
                    onNavigateToServices={() => navigateToScreen('servicos')}
                    onNavigateToOrcamento={() => navigateToScreen('orcamento')}
                  />
                  <TestimonialsSection
                    onNavigateToServices={() => navigateToScreen('servicos')}
                  />
                </Suspense>
              </SectionErrorBoundary>
            )}

            {/* TELA 03: Serviços & Condições Comerciais */}
            {currentScreen === 'servicos' && (
              <SectionErrorBoundary>
                <Suspense fallback={<ServicesSkeleton />}>
                  <ServicesSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
                </Suspense>
              </SectionErrorBoundary>
            )}

            {/* TELA 04: Processo em 4 Etapas */}
            {currentScreen === 'processo' && <ProcessSection />}

            {/* TELA 05: Diferenciais */}
            {currentScreen === 'diferenciais' && (
              <SectionErrorBoundary>
                <Suspense fallback={<DifferentialsSkeleton />}>
                  <DifferentialsSection onNavigateToPortfolio={() => navigateToScreen('portfolio')} />
                </Suspense>
              </SectionErrorBoundary>
            )}

            {/* TELA 06: Briefing & Agendamento */}
            {currentScreen === 'orcamento' && (
              <SectionErrorBoundary>
                <Suspense fallback={<BookingSkeleton />}>
                  <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
                </Suspense>
              </SectionErrorBoundary>
            )}

            {/* TELA 07: Perguntas Frequentes (FAQ) & Contato (Tela 8 incorporada ao final da Tela 7) */}
            {currentScreen === 'faq' && (
              <div className="space-y-0">
                <FaqSection />
                <ContactCtaSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DOCK / CONTROLADOR FIXO DE NAVEGAÇÃO MULTITELAS CENTRALIZADO E DISCRETO: < -------- > */}
      <nav
        aria-label="Navegador de telas"
        className="sticky bottom-0 z-30 bg-[#070A12]/80 backdrop-blur-md border-t border-white/[0.04] py-1.5 px-2 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-white/[0.06] shadow-sm">
            {/* Seta Esquerda (<) */}
            <button
              type="button"
              disabled={!previousScreen}
              onClick={handlePrevious}
              className="flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white bg-transparent hover:bg-white/[0.06] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label={previousScreen ? `Voltar para Tela ${previousScreen.shortTitle}` : 'Sem tela anterior'}
              title={previousScreen ? `Anterior: ${previousScreen.shortTitle}` : ''}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Traços / Pontos Centrais de Navegação Discretos (-------) */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-1.5">
              {SCREENS.map((s) => {
                const isSelected = s.id === currentScreen;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigateToScreen(s.id)}
                    title={`Tela ${s.number}: ${s.title}`}
                    aria-label={`Ir para ${s.title}`}
                    aria-current={isSelected ? 'page' : undefined}
                    className="group relative flex items-center justify-center py-1.5 px-0.5 focus:outline-none cursor-pointer"
                  >
                    {/* Traço / Indicador Minimalista */}
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'w-5 sm:w-6 bg-indigo-400/90 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                          : 'w-1.5 sm:w-2 bg-slate-700/60 group-hover:bg-slate-500 group-hover:w-2.5'
                      }`}
                    />
                    <span className="sr-only">
                      {s.number} - {s.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Seta Direita (>) */}
            <button
              type="button"
              disabled={!nextScreen}
              onClick={handleNext}
              className="flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white bg-transparent hover:bg-white/[0.06] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label={nextScreen ? `Avançar para Tela ${nextScreen.shortTitle}` : 'Última tela'}
              title={nextScreen ? `Próxima: ${nextScreen.shortTitle}` : ''}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Rodapé Institucional com Links de Telas e Termos Legais */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onSelectScreen={navigateToScreen}
        currentScreen={currentScreen}
        isHighContrast={isHighContrast}
        onToggleHighContrast={toggleHighContrast}
      />

      {/* Botão Flutuante Oficial do WhatsApp */}
      <FloatingWhatsApp />

      {/* Modais Legais (Política de Privacidade e Termos de Uso) */}
      <LegalModals
        isOpen={legalModal !== null}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
}
