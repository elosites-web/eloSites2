import React, { useEffect, useRef } from 'react';
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
  const savedScrollPositionRef = useRef<number>(0);

  // Tecla de atalho: Escape para fechar o menu, 'm' ou 'M' para abrir/fechar o menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === 'Escape' && isMenuOpen) {
        handleCloseMenuWithoutNav();
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isMenuOpen) {
          handleCloseMenuWithoutNav();
        } else {
          handleOpenMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Abre o menu salvando a posição de scroll anterior e travando a rolagem do documento
  const handleOpenMenu = () => {
    savedScrollPositionRef.current = window.scrollY || window.pageYOffset || 0;
    setIsMenuOpen(true);
  };

  // Fecha o menu sem navegação: restaura o scroll para a posição salva
  const handleCloseMenuWithoutNav = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: savedScrollPositionRef.current, behavior: 'instant' });
  };

  // Travar o scroll da página enquanto o menu de navegação estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  const currentMeta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];

  // Componente do Botão Personalizado de Menu (Apenas as 3 linhas estilizadas, sem moldura ou fundo)
  const renderMenuButton = () => (
    <button
      id="menu-de-navegacao-btn"
      type="button"
      onClick={handleOpenMenu}
      aria-expanded={isMenuOpen}
      aria-controls="multi-screen-navigation-modal"
      aria-label="Abrir Menu de Navegação"
      className="relative group w-11 h-11 flex items-center justify-center bg-transparent border-0 shadow-none active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-0"
    >
      {/* Ícone futurista e estilizado: 3 barras dinâmicas em gradiente neon — SEM MOLDURA, BORDA OU FUNDO */}
      <div className="relative flex flex-col justify-center items-center gap-[4.5px] w-5 h-5 pointer-events-none transition-transform duration-200 group-hover:scale-110">
        <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-300 group-hover:from-cyan-300 group-hover:to-indigo-200 transition-all duration-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
        <span className="w-3.5 h-[2px] rounded-full bg-gradient-to-r from-white to-cyan-200 group-hover:w-5 transition-all duration-200 self-start group-hover:self-center" />
        <span className="w-4.5 h-[2px] rounded-full bg-gradient-to-r from-teal-400 to-indigo-400 group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all duration-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
      </div>
    </button>
  );

  return (
    <>
      {/* 
        CABEÇALHOS DO SITE (Apenas quando o menu está FECHADO):
        - Com menu aberto: o cabeçalho original e sua logo no canto superior esquerdo são COMPLETAMENTE ocultados.
        - Na Tela Home (com menu fechado): SEM faixa de cabeçalho, SEM logotipo no canto superior esquerdo,
          apenas o botão do menu posicionado no centro horizontal superior.
        - Nas demais telas (com menu fechado): Faixa de cabeçalho sutil de vidro preservada com logotipo à esquerda e botão do menu à direita.
      */}
      {!isMenuOpen && isHome && (
        <header
          id="header-nav"
          className="fixed top-4 sm:top-6 left-0 right-0 z-40 pointer-events-none flex justify-center items-center"
        >
          <div className="pointer-events-auto">
            {renderMenuButton()}
          </div>
        </header>
      )}

      {!isMenuOpen && !isHome && (
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
                  }}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0 cursor-pointer"
                  aria-label="ēloSites — Ir para a Tela de Início"
                >
                  <EloLogo size="md" />
                </button>

                {/* Indicador sutil da tela ativa atual */}
                <div className="hidden lg:flex items-center pl-3 border-l border-white/[0.08]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-xs font-semibold text-slate-200">
                      {currentMeta.shortTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão do Menu à direita nas telas internas */}
              <div className="flex items-center ml-auto shrink-0 z-10">
                {renderMenuButton()}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 
        MODAL DO MENU DE NAVEGAÇÃO:
        - O cabeçalho original e logo à esquerda são totalmente removidos.
        - Fundo 3D da Home preenche 100% da viewport de forma visualmente contínua.
        - No lugar exato do botão do menu (topo centro), aparece o logotipo pequeno da ēloSites.
        - Abaixo dele, em cascata centrada, exatamente os 7 itens na ordem oficial:
          1. Home, 2. Início, 3. Portfólio, 4. Serviços, 5. Como funciona, 6. Orçamento, 7. FAQ & Contato.
        - Tamanho de fonte reduzido em exatamente 50%: 12px no mobile, 15px no tablet e 18px no desktop
          (redução exata de 50% frente aos 24px, 30px e 36px anteriores).
        - Abaixo de FAQ & Contato, um botãozinho discreto de 'X' com estilo índigo-neon para fechar.
        - Sem moldura retangular, caixa ou card delimitador.
      */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200 select-none overflow-y-auto"
          onClick={handleCloseMenuWithoutNav}
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

          {/* Somente os 7 nomes de seções em cascata — SEM QUADRO EM VOLTA */}
          <div
            className="relative w-full max-w-lg flex flex-col items-center justify-center text-center my-auto px-4 pt-14 pb-6 sm:pt-16 sm:pb-8 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 py-1 w-full">
              {SCREENS.map((screen, index) => {
                const isActive = screen.id === currentScreen;

                return (
                  <motion.li
                    key={screen.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.03 * index,
                      duration: 0.28,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectScreen(screen.id);
                      }}
                      className={`group relative py-1 px-3 sm:py-1.5 sm:px-4 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'text-cyan-300 font-bold scale-105 drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]'
                          : 'text-slate-200 hover:text-cyan-300 font-semibold hover:scale-105 hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.7)]'
                      }`}
                    >
                      {/*
                        Tipografia responsiva dos itens de menu:
                        - Mobile: clamp(14px, 4vw, 16px) com line-height: 1.25 (legibilidade ideal sem estourar altura)
                        - Tablet (sm): 15px
                        - Desktop (md): 18px (redução de 50% preservada em telas maiores)
                      */}
                      <span className="font-display nav-menu-link-text tracking-tight transition-transform duration-200 group-hover:-translate-y-0.5">
                        {screen.shortTitle}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Botãozinho discreto abaixo de FAQ & Contato do 'X' para fechar com estilo indigo-neon */}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.24, duration: 0.25 }}
              onClick={handleCloseMenuWithoutNav}
              aria-label="Fechar menu de navegação"
              className="mt-3.5 sm:mt-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-cyan-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:shadow-[0_0_16px_rgba(34,211,238,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 group-hover:text-cyan-300 transition-colors" />
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
};
