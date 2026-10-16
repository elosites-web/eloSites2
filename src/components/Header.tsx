import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS } from '../types';
import { X } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onPreviousScreen: () => void;
  onNextScreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitora scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 15;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tecla de atalho: Escape para fechar o menu, 'm' ou 'M' para abrir/fechar o menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Travar o scroll da página enquanto o menu de navegação estiver aberto
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

  return (
    <>
      {/* Faixa do cabeçalho de vidro azul esverdeado e transparente em degradê */}
      <header
        id="header-nav"
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-gradient-to-r from-[#031d24]/90 via-[#062c36]/85 to-[#071c2b]/90 backdrop-blur-md border-b border-cyan-500/25 py-3 shadow-xl shadow-teal-950/40'
            : 'bg-gradient-to-r from-[#031d24]/75 via-[#062c36]/70 to-[#071c2b]/75 backdrop-blur-sm border-b border-cyan-500/20 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-3 sm:gap-6 min-h-[44px]">
            {/* Logo do Estúdio à esquerda */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
              <button
                type="button"
                id="brand-logo-link"
                onClick={() => {
                  onSelectScreen('inicio');
                  setIsMenuOpen(false);
                }}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0 cursor-pointer"
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
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/25"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-xs font-semibold text-slate-200">
                      {currentMeta.shortTitle}
                    </span>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Ações Direitas: Botão Futurista Ícone-only do Menu */}
            <div className="flex items-center ml-auto shrink-0 z-10">
              {!isMenuOpen ? (
                <button
                  id="menu-de-navegacao-btn"
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-expanded={false}
                  aria-controls="multi-screen-navigation-modal"
                  aria-label="Abrir Menu de Navegação"
                  className="relative group w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400/80 shadow-lg shadow-teal-950/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {/* Fundo com gradiente cibernético e brilho */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-indigo-500/20 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400/70 blur-[2px] group-hover:scale-125 transition-transform" />

                  {/* Ícone futurista e estilizado: 3 barras dinâmicas em gradiente neon */}
                  <div className="relative flex flex-col justify-center items-center gap-[4.5px] w-5 h-5 pointer-events-none">
                    <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-300 group-hover:from-cyan-300 group-hover:to-indigo-200 transition-all duration-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                    <span className="w-3.5 h-[2px] rounded-full bg-gradient-to-r from-white to-cyan-200 group-hover:w-5 transition-all duration-200 self-start group-hover:self-center" />
                    <span className="w-4.5 h-[2px] rounded-full bg-gradient-to-r from-teal-400 to-indigo-400 group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all duration-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu de navegação"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/40 hover:border-cyan-300 shadow-md flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
                >
                  <X className="w-5 h-5 text-slate-300 group-hover:text-cyan-300 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL / PAINEL: Apenas os nomes das seções uma abaixo da outra com background ao fundo dos nomes */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pt-24 pb-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Card com o background ao fundo dos nomes das seções */}
          <div
            className="relative w-full max-w-lg glass-panel bg-gradient-to-b from-[#081820]/95 via-[#06121b]/95 to-[#070e17]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/60 flex flex-col items-center justify-center text-center my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brilhos decorativos no background ao fundo dos nomes */}
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-indigo-600/15 blur-3xl rounded-full pointer-events-none" />

            {/* Botão fechar no canto superior direito do card */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu de navegação"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/50 shadow-md flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-cyan-300 transition-colors" />
              </button>
            </div>

            {/* Apenas os nomes das seções, uma abaixo da outra, na identidade visual do site */}
            <ul className="flex flex-col items-center justify-center gap-2.5 sm:gap-4 py-3 w-full">
              {SCREENS.map((screen) => {
                const isActive = screen.id === currentScreen;

                return (
                  <li key={screen.id} className="w-full flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScreen(screen.id);
                        setIsMenuOpen(false);
                      }}
                      className={`group relative w-full py-2.5 sm:py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'text-cyan-300 font-bold drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]'
                          : 'text-slate-300 hover:text-white font-semibold hover:drop-shadow-[0_0_14px_rgba(129,140,248,0.6)]'
                      }`}
                    >
                      {/* Efeito ao passar o cursor / estado ativo */}
                      <div
                        className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-cyan-950/60 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                            : 'opacity-0 group-hover:opacity-100 bg-white/[0.04] border border-white/[0.08] group-hover:scale-[1.02]'
                        }`}
                      />

                      <span className="relative z-10 font-display text-xl sm:text-2xl md:text-[1.75rem] tracking-tight transition-transform duration-200 group-hover:-translate-y-0.5">
                        {screen.shortTitle}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
