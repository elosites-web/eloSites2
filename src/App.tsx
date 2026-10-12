import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProcessSection } from './components/ProcessSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { DifferentialsSection } from './components/DifferentialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactCtaSection } from './components/ContactCtaSection';
import { ProjectBriefBookingSection } from './components/ProjectBriefBookingSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LegalModals } from './components/LegalModals';
import { ScreenId, SCREENS } from './types';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

// Cena 3D persistente carregada de forma assíncrona
const Persistent3DScene = lazy(() =>
  import('./components/Persistent3DScene').then((mod) => ({ default: mod.Persistent3DScene }))
);

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

  const currentMeta = SCREENS[currentIndex] || SCREENS[0];

  return (
    <div className={`min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Cena 3D Persistente procedural no fundo */}
      <Suspense fallback={null}>
        <Persistent3DScene />
      </Suspense>

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
          {/* Breadcrumb da tela atual */}
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{currentMeta.title}</span>
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
              <div>
                <Hero
                  onNavigateToPortfolio={() => navigateToScreen('portfolio')}
                  onNavigateToServices={() => navigateToScreen('servicos')}
                />

                {/* Painel de Destaques e Acesso Rápido às outras 7 Telas */}
                <section className="py-12 sm:py-16 bg-[#080B15]/90 border-t border-white/[0.05]">
                  <div className="page-shell page-x">
                    <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
                      <span className="text-xs font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
                        Arquitetura Multitelas ēloSites
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                        Explore cada seção em uma tela dedicada
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Sem rolagem infinita confusa: cada tela tem um propósito comercial objetivo.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {SCREENS.filter((s) => s.id !== 'inicio').map((screen) => (
                        <button
                          key={screen.id}
                          type="button"
                          onClick={() => navigateToScreen(screen.id)}
                          className="p-4 rounded-xl border border-white/[0.07] bg-slate-950/60 hover:bg-slate-900/80 hover:border-indigo-400/40 text-left transition-all group flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-end text-xs font-mono text-slate-400 mb-2">
                            <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                              {screen.shortTitle}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {screen.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TELA 02: Portfólio de Projetos Reais */}
            {currentScreen === 'portfolio' && (
              <PortfolioSection
                onNavigateToServices={() => navigateToScreen('servicos')}
                onNavigateToOrcamento={() => navigateToScreen('orcamento')}
              />
            )}

            {/* TELA 03: Serviços & Condições Comerciais */}
            {currentScreen === 'servicos' && (
              <ServicesSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
            )}

            {/* TELA 04: Processo em 4 Etapas */}
            {currentScreen === 'processo' && <ProcessSection />}

            {/* TELA 05: Diferenciais */}
            {currentScreen === 'diferenciais' && <DifferentialsSection />}

            {/* TELA 06: Briefing & Agendamento */}
            {currentScreen === 'orcamento' && (
              <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
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
                  className={`flex items-center justify-center transition-all ${
                    isSelected
                      ? 'px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/40 ring-1 ring-indigo-400'
                      : 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono border border-white/[0.05]'
                  }`}
                >
                  {isSelected ? (
                    <span className="flex items-center gap-1.5">
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
