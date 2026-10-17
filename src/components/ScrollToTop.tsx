import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  currentScreen?: string;
  isMenuOpen?: boolean;
  isWhatsAppBubbleOpen?: boolean;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  currentScreen = 'home',
  isMenuOpen = false,
  isWhatsAppBubbleOpen = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  // Monitora o scroll da janela — aparece apenas após rolar mais de 400px do topo
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > 400);
    };

    // Checagem inicial no carregamento ou troca de tela
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentScreen]);

  // Função para retornar suavemente ao topo da página
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [prefersReduced]);

  // Se o menu de navegação estiver aberto ou o balão de chat do WhatsApp estiver ativo,
  // ocultamos para manter a interface limpa e sem sobreposição de elementos
  const shouldRender = isVisible && !isMenuOpen && !isWhatsAppBubbleOpen;

  // Ajusta o posicionamento vertical:
  // - Na Home (onde o botão do WhatsApp fica oculto), fica a 1rem (16px) do fundo.
  // - Nas demais telas (onde o botão do WhatsApp está presente no canto inferior direito),
  //   fica empilhado logo acima do botão do WhatsApp com espaçamento harmônico.
  const isHomeScreen = currentScreen === 'home';
  const positionClasses = isHomeScreen
    ? 'bottom-4 sm:bottom-6 right-4 sm:right-6'
    : 'bottom-[4.75rem] sm:bottom-[5.5rem] right-4 sm:right-6';

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="scroll-to-top-wrapper"
          className={`fixed ${positionClasses} z-40 select-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]`}
          initial={
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.65, y: 16 }
          }
          animate={
            prefersReduced
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.65, y: 16 }
          }
          transition={{
            duration: prefersReduced ? 0.15 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.button
            id="scroll-to-top-button"
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            title="Voltar ao topo"
            whileHover={prefersReduced ? {} : { scale: 1.08, y: -2 }}
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B101D]/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white shadow-lg shadow-black/60 hover:shadow-[0_0_22px_rgba(168,85,247,0.45)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {/* Efeito sutil de brilho interno com a identidade ēloSites */}
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-t from-purple-600/10 to-indigo-500/10 group-hover:from-purple-600/25 group-hover:to-indigo-500/25 transition-opacity pointer-events-none"
              aria-hidden="true"
            />

            <ArrowUp className="w-5 h-5 text-purple-300 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-200 relative z-10" />

            {/* Tooltip minimalista acessível ao passar o mouse em telas médias e grandes */}
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-0.5 rounded-md bg-slate-900/95 text-[10px] font-medium text-slate-200 border border-white/10 shadow-md whitespace-nowrap hidden sm:block"
            >
              Voltar ao topo
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
