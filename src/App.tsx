import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { Persistent3DBackground } from './components/Persistent3DBackground';
import { PointerSpotlight } from './components/PointerSpotlight';
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
import { SitemapModal } from './components/SitemapModal';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import {
  DifferentialsSkeleton,
  PortfolioSkeleton,
  ServicesSkeleton,
  BookingSkeleton,
} from './components/SectionSkeletons';
import { ScreenId, SCREENS } from './types';
import { shouldReduceMedia, getMotionTier } from './mediaPrefs';
import { withViewTransition, supportsViewTransitions } from './viewTransition';

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
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [direction, setDirection] = useState<number>(1);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isWhatsAppBubbleOpen, setIsWhatsAppBubbleOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Hook do Framer Motion combinado com a preferência de acessibilidade
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // View Transitions (crossfade) quando suportado e o tier de movimento permite.
  // Caso contrário mantemos a transição suave atual (fallback).
  const useViewTransitions = supportsViewTransitions() && getMotionTier() !== 'none';

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
      'home',
      'inicio',
      'portfolio',
      'servicos',
      'processo',
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
      } else if (rawHash === 'diferenciais') {
        setCurrentScreen((prev) => {
          if (prev !== 'processo') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'processo');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'processo';
        });
        setTimeout(() => {
          const el = document.getElementById('diferenciais');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
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
      } else if (rawHash === 'apresentacao') {
        setCurrentScreen('inicio');
        setTimeout(() => {
          const el = document.getElementById('apresentacao');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (rawHash === 'sitemap' || rawHash === 'mapa-do-site') {
        setIsSitemapOpen(true);
      }
    };

    // Lê na carga inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ao trocar de tela, atualiza o hash, a direção do slide lateral e rola para o topo
  const navigateToScreen = (screenId: ScreenId) => {
    setIsMenuOpen(false);
    const prevIdx = SCREENS.findIndex((s) => s.id === currentScreen);
    const nextIdx = SCREENS.findIndex((s) => s.id === screenId);
    const nextDirection = nextIdx !== -1 && prevIdx !== -1 && nextIdx !== prevIdx ? (nextIdx > prevIdx ? 1 : -1) : direction;
    withViewTransition(() => {
      setDirection(nextDirection);
      setCurrentScreen(screenId);
    });
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
    const isHome = currentScreen === 'home' || currentScreen === 'inicio';

    const pageTitle = isHome
      ? 'ēloSites — Criação de Sites Profissionais com SEO Técnico e Conversão'
      : `${meta.title} | ēloSites — Sites Profissionais com SEO Técnico`;

    const pageDesc = isHome
      ? 'Criação de sites profissionais e landing pages com SEO técnico e foco em conversão para pequenos negócios e profissionais liberais. Alta performance e código limpo.'
      : `${meta.description} Desenvolvimento de sites institucionais e landing pages de alta conversão pela ēloSites.`;

    const canonicalUrl = currentScreen === 'home'
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

  // 'SlideFade' transition variant for AnimatePresence:
  // Uses a smooth deceleration curve [0.16, 1, 0.3, 1] on entrance,
  // and a distinctly differentiated exit easing curve [0.7, 0, 0.84, 0] (anticipation & swift departure)
  const slideFadeVariants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? 16 : -16,
      y: prefersReduced ? 0 : dir >= 0 ? 8 : -8,
      scale: prefersReduced ? 1 : 0.995,
    }),
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.26,
          ease: [0.16, 1, 0.3, 1], // Deceleration entrance curve
        },
        y: {
          duration: prefersReduced ? 0 : 0.26,
          ease: [0.16, 1, 0.3, 1],
        },
        scale: {
          duration: prefersReduced ? 0 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        },
        opacity: {
          duration: prefersReduced ? 0.15 : 0.22,
          ease: 'easeOut',
        },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? -16 : 16,
      y: prefersReduced ? 0 : dir >= 0 ? -8 : 8,
      scale: prefersReduced ? 1 : 0.99,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.18,
          ease: [0.7, 0, 0.84, 0], // Differentiated exit easing curve (crisp anticipation acceleration)
        },
        y: {
          duration: prefersReduced ? 0 : 0.18,
          ease: [0.7, 0, 0.84, 0],
        },
        scale: {
          duration: prefersReduced ? 0 : 0.16,
          ease: [0.7, 0, 0.84, 0],
        },
        opacity: {
          duration: prefersReduced ? 0.12 : 0.15,
          ease: [0.4, 0, 1, 1],
        },
      },
    }),
  };

  // Conteúdo da tela ativa, reutilizado pelos dois caminhos de transição:
  // View Transitions (crossfade) ou AnimatePresence (fallback suave atual).
  const renderActiveScreen = () => (
    <>
      {/* TELA 01: Home (Background-only Hero com Menu Centralizado e Logo Flutuante) */}
      {currentScreen === 'home' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style]">
          <Hero
            mode="home"
            isMenuOpen={isMenuOpen}
          />
        </div>
      )}

      {/* TELA 02: Início (Apresentação Completa, Marquee 90s, CTAs e Terminal 3D) */}
      {currentScreen === 'inicio' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style]">
          <Hero
            mode="inicio"
            onNavigateToPortfolio={() => navigateToScreen('portfolio')}
            onNavigateToServices={() => navigateToScreen('servicos')}
          />
        </div>
      )}

      {/* TELA 02: Portfólio de Projetos Reais & Depoimentos (Social Proof) */}
      {currentScreen === 'portfolio' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style]">
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
        </div>
      )}

      {/* TELA 03: Serviços & Condições Comerciais */}
      {currentScreen === 'servicos' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<ServicesSkeleton />}>
              <ServicesSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 04: Processo em 4 Etapas & Diferenciais como continuidade */}
      {currentScreen === 'processo' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style] space-y-0">
          <ProcessSection />
          <SectionErrorBoundary>
            <Suspense fallback={<DifferentialsSkeleton />}>
              <DifferentialsSection onNavigateToPortfolio={() => navigateToScreen('portfolio')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 05: Briefing & Agendamento */}
      {currentScreen === 'orcamento' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<BookingSkeleton />}>
              <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 06: Perguntas Frequentes (FAQ) & Contato */}
      {currentScreen === 'faq' && (
        <div style={{ willChange: 'transform', contain: 'layout style' }} className="w-full will-change-transform [contain:layout_style] space-y-0">
          <FaqSection />
          <ContactCtaSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
        </div>
      )}
    </>
  );

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

      {/* Efeitos exclusivos do tier 'full' (holofote, pausas) */}
      <PointerSpotlight />

      {/* Header Fixo com Botão Único "MENU DE NAVEGAÇÃO" */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={navigateToScreen}
        onPreviousScreen={handlePrevious}
        onNextScreen={handleNext}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Conteúdo Principal — Exibição Estratégica da Tela Ativa com Transição Fluida e Responsiva */}
      <main className="flex-1 relative z-10 overflow-x-hidden" id="main-content" tabIndex={-1}>
        {useViewTransitions ? (
          <div
            key={currentScreen}
            style={{ contain: 'layout style' }}
            className="w-full [contain:layout_style]"
          >
            {renderActiveScreen()}
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={slideFadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ willChange: 'transform', contain: 'layout style' }}
              className="w-full will-change-transform [contain:layout_style]"
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Rodapé Institucional com Links de Telas e Termos Legais */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onOpenSitemap={() => setIsSitemapOpen(true)}
        onSelectScreen={navigateToScreen}
        currentScreen={currentScreen}
        isHighContrast={isHighContrast}
        onToggleHighContrast={toggleHighContrast}
        isWhatsAppBubbleOpen={isWhatsAppBubbleOpen}
      />

      {/* Botão Flutuante Oficial do WhatsApp */}
      <FloatingWhatsApp onBubbleStateChange={setIsWhatsAppBubbleOpen} />

      {/* Modais Legais (Política de Privacidade e Termos de Uso) */}
      <LegalModals
        isOpen={legalModal !== null}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />

      {/* Modal do Mapa do Site Dinâmico XML (Google Search Console) */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigateToScreen={navigateToScreen}
      />
    </div>
  );
}
