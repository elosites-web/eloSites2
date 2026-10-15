import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ScreenId, SCREENS, SITE_CONFIG, whatsappUrl } from '../types';
import {
  Menu,
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  Briefcase,
  Workflow,
  Zap,
  CalendarCheck,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onPreviousScreen: () => void;
  onNextScreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onPreviousScreen,
  onNextScreen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitora scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tecla de atalho: Escape para fechar o menu, 'm' ou 'M' para abrir/fechar o menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o foco estiver em um input ou textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Travar o scroll da página enquanto o modal de navegação estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const currentMeta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];
  const currentIndex = SCREENS.findIndex((s) => s.id === currentScreen);
  const totalScreens = SCREENS.length;

  const headerWhatsappUrl = whatsappUrl(SITE_CONFIG.headerWhatsappMessage);

  // Mapa de ícones para cada tela
  const getScreenIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'LayoutGrid':
        return LayoutGrid;
      case 'Briefcase':
        return Briefcase;
      case 'Workflow':
        return Workflow;
      case 'Zap':
        return Zap;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'HelpCircle':
        return HelpCircle;
      case 'PhoneCall':
        return PhoneCall;
      default:
        return LayoutGrid;
    }
  };

  return (
    <>
      <header
        id="header-nav"
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-[#080C15]/95 backdrop-blur-md border-b border-white/[0.08] py-3 shadow-xl shadow-black/40'
            : 'bg-[#080C15]/80 backdrop-blur-sm border-b border-white/[0.06] py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-3 sm:gap-6 min-h-[44px]">
            {/* Logo do Estúdio — Anima para o centro da tela quando menu está aberto e volta à esquerda ao fechar */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className={`flex items-center gap-2 sm:gap-3 shrink-0 z-10 transition-all duration-300 ${
                isMenuOpen
                  ? 'absolute left-1/2 -translate-x-1/2'
                  : 'relative left-0 translate-x-0'
              }`}
            >
              <button
                type="button"
                id="brand-logo-link"
                onClick={() => {
                  onSelectScreen('inicio');
                  setIsMenuOpen(false);
                }}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0"
                aria-label="ēloSites — Ir para a Tela de Início"
              >
                <EloLogo size="md" />
              </button>

              {/* Indicador sutil da tela ativa atual (visível apenas com menu fechado) */}
              {!isMenuOpen && (
                <div className="hidden lg:flex items-center pl-3 border-l border-white/[0.08]">
                  <motion.div
                    layoutId="shared-active-screen-header-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/25"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200">
                      {currentMeta.shortTitle}
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Ações Direitas: Botão MENU (oculto quando o menu já está aberto) */}
            <div className="flex items-center ml-auto shrink-0 z-10">
              {!isMenuOpen && (
                <button
                  id="menu-de-navegacao-btn"
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-expanded={false}
                  aria-controls="multi-screen-navigation-modal"
                  aria-label="Abrir Menu de Navegação"
                  className="relative group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-[0_0_24px_rgba(99,102,241,0.55)] active:shadow-[0_0_32px_rgba(168,85,247,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all border border-indigo-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 text-center shrink-0 cursor-pointer"
                >
                  <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                  <span className="tracking-wider uppercase font-bold text-xs sm:text-xs text-center drop-shadow-sm">
                    MENU
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL / PAINEL IMERSIVO DE NAVEGAÇÃO MULTITELAS */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Telas ēloSites"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pt-20 sm:pt-24 bg-black/85 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#090D16] border border-white/[0.12] rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topbar do Modal */}
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                    Menu de Navegação
                  </h2>
                  <p className="text-xs text-slate-400">
                    Selecione estrategicamente a tela que deseja visualizar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[11px] font-mono text-slate-500">
                  ESC para fechar
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu de navegação"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid com TODAS as seções/telas */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {SCREENS.map((screen, idx) => {
                const isActive = screen.id === currentScreen;
                const Icon = getScreenIcon(screen.iconName);

                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => {
                      onSelectScreen(screen.id);
                      setIsMenuOpen(false);
                    }}
                    className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between min-h-[148px] relative hover:-translate-y-1 ${
                      isActive
                        ? 'bg-gradient-to-b from-indigo-950/90 to-slate-950 border-indigo-400/80 shadow-[0_0_24px_rgba(99,102,241,0.35)] ring-1 ring-indigo-400/70'
                        : 'bg-slate-950/70 border-white/[0.08] hover:border-indigo-400/50 hover:bg-slate-900/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="modal-active-card-glow"
                        className="absolute inset-0 rounded-2xl border-2 border-indigo-400/90 shadow-[0_0_24px_rgba(99,102,241,0.45)] pointer-events-none z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {/* Topo do card */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-900 text-slate-400 group-hover:text-indigo-300 border border-white/[0.05]'
                          }`}
                        >
                          {screen.number}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-slate-400">
                          {screen.badge}
                        </span>
                      </div>

                      <Icon
                        className={`w-4.5 h-4.5 ${
                          isActive
                            ? 'text-indigo-300'
                            : 'text-slate-500 group-hover:text-indigo-400 transition-colors'
                        }`}
                      />
                    </div>

                    {/* Título e Descrição */}
                    <div className="mt-3 space-y-1">
                      <h3
                        className={`text-sm sm:text-base font-bold font-display ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-200 group-hover:text-white transition-colors'
                        }`}
                      >
                        {screen.shortTitle}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {screen.description}
                      </p>
                    </div>

                    {/* Status de ativo */}
                    {isActive ? (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Em exibição agora</span>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-300 transition-colors">
                        <span>Acessar tela</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Rodapé do Modal com navegação sequencial rápida */}
            <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    onPreviousScreen();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center text-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-white/[0.07] transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tela Anterior</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === totalScreens - 1}
                  onClick={() => {
                    onNextScreen();
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center text-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-white/[0.07] transition-all"
                >
                  <span>Próxima Tela</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden md:inline">
                  Dúvidas sobre o projeto?
                </span>
                <a
                  href={whatsappUrl(SITE_CONFIG.mobileMenuWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
