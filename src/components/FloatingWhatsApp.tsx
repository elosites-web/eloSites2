import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG } from '../types';
import { X } from 'lucide-react';

// Função para verificar se está dentro do horário comercial do schema (Segunda a Sexta, 09:00 - 18:00)
const isWithinBusinessHours = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 5 = Sexta, 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const isWeekday = day >= 1 && day <= 5;
  const isDuringHours = currentMinutes >= 9 * 60 && currentMinutes < 18 * 60;
  return isWeekday && isDuringHours;
};

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => isWithinBusinessHours());

  useEffect(() => {
    // Atualiza status do horário periodicamente
    setIsOnline(isWithinBusinessHours());
    const interval = setInterval(() => {
      setIsOnline(isWithinBusinessHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Exibe o balão convidativo após 2.5 segundos
    const showTimer = setTimeout(() => {
      if (!hasDismissed) {
        setShowTooltip(true);
      }
    }, 2500);

    return () => clearTimeout(showTimer);
  }, [hasDismissed]);

  useEffect(() => {
    // Recolhe automaticamente o balão para o ícone compacto após 6 segundos de exibição no celular/desktop
    if (showTooltip) {
      const collapseTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 6000);

      return () => clearTimeout(collapseTimer);
    }
  }, [showTooltip]);

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    SITE_CONFIG.floatingWhatsappMessage
  )}`;

  return (
    <aside
      aria-label="Atendimento rápido via WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none"
    >
      {/* Tooltip / Popup Convidativo Centralizado com animação suave de mola (spring) via Framer Motion */}
      <AnimatePresence>
        {showTooltip && !hasDismissed && (
          <motion.div
            key="whatsapp-popup-tooltip"
            id="whatsapp-popup-tooltip"
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92, transition: { duration: 0.2, ease: 'easeOut' } }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              mass: 0.65,
              bounce: 0.28,
            }}
            className="mb-3 w-[min(265px,calc(100vw-2rem))] bg-slate-900/95 border border-indigo-500/30 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-md pointer-events-auto relative origin-bottom-right z-50"
          >
            {/* Botão de Fechar discreto no canto superior direito */}
            <button
              type="button"
              id="close-whatsapp-tooltip"
              onClick={() => {
                setShowTooltip(false);
                setHasDismissed(true);
              }}
              className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Fechar mensagem de atendimento"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Indicador de Horário de Funcionamento (Schema: 09:00 - 18:00) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mb-2 bg-slate-950/80 border border-white/[0.08] w-fit">
              <span className="relative flex h-2 w-2">
                {isOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                )}
              </span>
              <span className={isOnline ? 'text-emerald-400 font-semibold' : 'text-amber-300 font-semibold'}>
                {isOnline ? 'Estamos online agora' : 'Responderemos em breve'}
              </span>
            </div>

            {/* Conteúdo Convidativo */}
            <div className="pt-0.5 space-y-1">
              <span className="font-semibold block text-xs sm:text-sm text-indigo-300">
                Precisa de um site?
              </span>
              <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                Fale diretamente comigo pelo WhatsApp para tirar dúvidas sobre seu projeto.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante Principal com Animação Sutil de Pulsação Constante */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp com a ēloSites"
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl transition-all duration-200 border-2 border-indigo-400/40 active:scale-95 animate-subtle-pulse hover:shadow-indigo-500/40 z-50"
      >
        {/* Indicador de Status Online / Horário */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090D16]" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-[#090D16]" />
          )}
        </span>

        {/* Ícone Oficial do WhatsApp com rotação de 500ms configurada no hover e active */}
        <WhatsAppIcon className="w-7 h-7 text-emerald-300 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110 will-change-transform" />
      </a>
    </aside>
  );
};
