import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Persistent3DBackground } from './components/Persistent3DBackground';
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
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

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

  // Sincronização inicial e bidirecional com a hash da URL
  useEffect(() => {
    const validIds: ScreenId[] = [
      'inicio',
      'portfolio',
      'servicos',
      'processo',
      'diferenciais',
      'orcamento',
      'faq',
      'contato',
    ];

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      if (validIds.includes(hash)) {
        setCurrentScreen((prev) => {
          const prevIdx = SCREENS.findIndex((s) => s.id === prev);
          const newIdx = SCREENS.findIndex((s) => s.id === hash);
          setSlideDirection(newIdx >= prevIdx ? 1 : -1);
          return hash;
        });
      }
    };

    // Lê na carga inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ao trocar de tela, calcula a direção lateral (slide-in), atualiza o hash e rola para o topo
  const navigateToScreen = (screenId: ScreenId) => {
    const currentIdx = SCREENS.findIndex((s) => s.id === currentScreen);
    const targetIdx = SCREENS.findIndex((s) => s.id === screenId);
    setSlideDirection(targetIdx >= currentIdx ? 1 : -1);
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
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

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

  return (
    <div className={`min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Barra de Progresso de Leitura no Topo */}
      <ReadingProgressBar key={currentScreen} currentScreen={currentScreen} />

      {/* Cena 3D Persistente procedural no fundo */}
      <Persistent3DBackground />

      {/* Header Fixo com Botão Único "MENU DE NAVEGAÇÃO" */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={navigateToScreen}
        onPreviousScreen={handlePrevious}
        onNextScreen={handleNext}
      />

      {/* Barra de Status e Transição da Tela Atual */}
      <div className="pt-20 sm:pt-24 pb-2 px-4 sm:px-8 border-b border-white/[0.04] bg-[#070A12]/90 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          {/* Breadcrumb da tela atual com layoutId contínuo */}
          <div className="flex items-center gap-2">
            <motion.span
              layoutId="status-bar-active-number"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold"
            >
              {currentMeta.number}
            </motion.span>
            <motion.span
              key={`title-${currentScreen}`}
              layoutId="status-bar-active-title"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="text-white font-semibold"
            >
              {currentMeta.title}
            </motion.span>
          </div>

          {/* Atalhos rápidos de anterior / próximo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!previousScreen}
              onClick={handlePrevious}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-white/[0.06] transition-all"
              title={previousScreen ? `Ir para ${previousScreen.shortTitle} (Seta Esquerda)` : ''}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anterior: {previousScreen?.shortTitle}</span>
            </button>

            <button
              type="button"
              disabled={!nextScreen}
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 disabled:opacity-30 disabled:pointer-events-none border border-indigo-500/30 transition-all font-medium"
              title={nextScreen ? `Ir para ${nextScreen.shortTitle} (Seta Direita)` : ''}
            >
              <span className="hidden sm:inline">Próxima: {nextScreen?.shortTitle}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal — Exibição Estratégica da Tela Ativa com Efeito de Slide-in Lateral */}
      <main className="flex-1 relative z-10 overflow-x-hidden" id="main-content">
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          <motion.div
            key={currentScreen}
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideDirection * 60 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {/* TELA 01: Início & Apresentação */}
            {currentScreen === 'inicio' && (
              <Hero
                onNavigateToPortfolio={() => navigateToScreen('portfolio')}
                onNavigateToServices={() => navigateToScreen('servicos')}
              />
            )}

            {/* TELA 02: Portfólio de Projetos Reais */}
            {currentScreen === 'portfolio' && (
              <Suspense fallback={<PortfolioSkeleton />}>
                <PortfolioSection
                  onNavigateToServices={() => navigateToScreen('servicos')}
                  onNavigateToOrcamento={() => navigateToScreen('orcamento')}
                />
              </Suspense>
            )}

            {/* TELA 03: Serviços & Condições Comerciais */}
            {currentScreen === 'servicos' && (
              <Suspense fallback={<ServicesSkeleton />}>
                <ServicesSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
              </Suspense>
            )}

            {/* TELA 04: Processo em 4 Etapas */}
            {currentScreen === 'processo' && <ProcessSection />}

            {/* TELA 05: Diferenciais */}
            {currentScreen === 'diferenciais' && (
              <Suspense fallback={<DifferentialsSkeleton />}>
                <DifferentialsSection onNavigateToPortfolio={() => navigateToScreen('portfolio')} />
              </Suspense>
            )}

            {/* TELA 06: Briefing & Agendamento */}
            {currentScreen === 'orcamento' && (
              <Suspense fallback={<BookingSkeleton />}>
                <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
              </Suspense>
            )}

            {/* TELA 07: Perguntas Frequentes (FAQ) */}
            {currentScreen === 'faq' && <FaqSection />}

            {/* TELA 08: Contato & Atendimento Direto */}
            {currentScreen === 'contato' && (
              <ContactCtaSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DOCK / CONTROLADOR FIXO DE NAVEGAÇÃO MULTITELAS NO RODAPÉ */}
      <nav
        aria-label="Navegador de telas"
        className="sticky bottom-0 z-30 bg-[#070A12]/95 backdrop-blur-md border-t border-white/[0.08] py-2.5 px-4 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Botão Anterior */}
          <button
            type="button"
            disabled={!previousScreen}
            onClick={handlePrevious}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-white/[0.06] transition-all"
            aria-label={previousScreen ? `Voltar para Tela ${previousScreen.shortTitle}` : 'Sem tela anterior'}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Stepper / Indicador de bolinhas ou números das 8 telas */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 px-2">
            {SCREENS.map((s, idx) => {
              const isSelected = s.id === currentScreen;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigateToScreen(s.id)}
                  title={`${s.number}. ${s.title}`}
                  aria-label={`Ir para ${s.title}`}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`flex items-center justify-center transition-all relative ${
                    isSelected
                      ? 'px-3 py-1.5 rounded-lg text-white font-bold text-xs'
                      : 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono border border-white/[0.05]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="stepper-active-indicator"
                      className="absolute inset-0 rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/40 ring-1 ring-indigo-400 -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isSelected ? (
                    <span className="flex items-center gap-1.5 relative z-10">
                      <span>{s.number}</span>
                      <span className="hidden md:inline font-sans font-semibold">{s.shortTitle}</span>
                    </span>
                  ) : (
                    <span>{s.number}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Botão Próximo */}
          <button
            type="button"
            disabled={!nextScreen}
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white shadow-md shadow-indigo-600/25 transition-all"
            aria-label={nextScreen ? `Avançar para Tela ${nextScreen.shortTitle}` : 'Última tela'}
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
