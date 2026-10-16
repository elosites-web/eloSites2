import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS } from '../types';
import { X } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onPreviousScreen?: () => void;
  onNextScreen?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const isHome = currentScreen === 'home';

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
        setIsMenuOpen(!isMenuOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

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

  // Componente do Botão Personalizado de Menu
  const renderMenuButton = () => (
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
  );

  return (
    <>
      {/* 
        CABEÇALHO DA TELA:
        - Na Tela Inicial (Início): SEM faixa de cabeçalho, SEM logotipo na barra, SEM marcação de início.
          O botão do menu fica centralizado no meio em cima.
        - Nas demais telas: Faixa sutil preservada para contexto de navegação.
      */}
      {isHome ? (
        // Tela Inicial: Apenas o botão do menu centralizado no topo, sem faixa de cabeçalho
        <header
          id="header-nav"
          className="fixed top-4 sm:top-6 left-0 right-0 z-40 pointer-events-none flex justify-center items-center"
        >
          <div className="pointer-events-auto">
            {!isMenuOpen && renderMenuButton()}
          </div>
        </header>
      ) : (
        // Demais Telas: Faixa de vidro azul esverdeado transparente com navegação
        <header
          id="header-nav"
          className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#031d24]/90 via-[#062c36]/85 to-[#071c2b]/90 backdrop-blur-md border-b border-cyan-500/25 py-3 shadow-xl shadow-teal-950/40 transition-all duration-300"
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

                {/* Indicador sutil da tela ativa atual */}
                {!isMenuOpen && (
                  <div className="hidden lg:flex items-center pl-3 border-l border-white/[0.08]">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                      <span className="text-xs font-semibold text-slate-200">
                        {currentMeta.shortTitle}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão do Menu à direita nas telas internas */}
              <div className="flex items-center ml-auto shrink-0 z-10">
                {!isMenuOpen && renderMenuButton()}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 
        MODAL DO MENU DE NAVEGAÇÃO:
        - Sem quadro em volta (background 3D totalmente visível).
        - No lugar onde estava o botão do menu (topo centro), aparece o logotipo pequeno.
        - Abaixo, em cascata, somente as palavras/nomes das seções (Início, Portfólio, Serviços, Como Funciona, Orçamento, FAQ & Contato).
        - Abaixo de FAQ & Contato, um botãozinho discreto de 'X' para fechar.
      */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200 select-none overflow-y-auto"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Logotipo pequeno no lugar exato onde estava o botão menu no topo */}
          <div
            className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                onSelectScreen('home');
                setIsMenuOpen(false);
              }}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1 transition-transform hover:scale-105 cursor-pointer flex items-center justify-center"
              aria-label="ēloSites — Home"
            >
              <img
                src="/logo-elosites-final.png"
                alt="ēloSites"
                className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.55)]"
              />
            </button>
          </div>

          {/* Somente os nomes das seções em cascata — SEM QUADRO EM VOLTA */}
          <div
            className="relative w-full max-w-xl flex flex-col items-center justify-center text-center my-auto px-4 py-8 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col items-center justify-center gap-3.5 sm:gap-5 md:gap-6 py-2 w-full">
              {SCREENS.map((screen, index) => {
                const isActive = screen.id === currentScreen;

                return (
                  <motion.li
                    key={screen.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.04 * index,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScreen(screen.id);
                        setIsMenuOpen(false);
                      }}
                      className={`group relative py-1.5 px-4 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'text-cyan-300 font-bold scale-105 drop-shadow-[0_0_22px_rgba(34,211,238,0.9)]'
                          : 'text-slate-200 hover:text-cyan-300 font-semibold hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]'
                      }`}
                    >
                      <span className="font-display text-2xl sm:text-3xl md:text-[2.25rem] tracking-tight transition-transform duration-200 group-hover:-translate-y-0.5">
                        {screen.shortTitle}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Botãozinho discreto abaixo de FAQ e contato do x para fechar com estilo indigo-neon */}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28, duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="mt-6 sm:mt-8 w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-cyan-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:shadow-[0_0_16px_rgba(34,211,238,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
            >
              <X className="w-4 h-4 text-indigo-300 group-hover:text-cyan-300 transition-colors" />
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
};
