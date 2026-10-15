import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import { X } from 'lucide-react';

// Função para verificar se está dentro do horário comercial (Segunda a Sexta, 09:00 - 18:00)
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
  const [isOnline, setIsOnline] = useState<boolean>(() => isWithinBusinessHours());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Atualiza status do horário periodicamente
    setIsOnline(isWithinBusinessHours());
    const interval = setInterval(() => {
      setIsOnline(isWithinBusinessHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 1) Aparece exatamente após 10 segundos (10.000 ms) de inatividade ou carregamento inicial
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // 2) Quando o balão aparece, fecha sozinho após 10 segundos da aparição
    if (!showTooltip) return;

    const autoCloseTimer = setTimeout(() => {
      setShowTooltip(false);
      // Se fechar sozinho após os 10 segundos: reaparece 2 minutos e 30 segundos (150.000 ms) após fechar sozinho
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 150000);
    }, 10000);

    return () => clearTimeout(autoCloseTimer);
  }, [showTooltip]);

  // Se o usuário fechar antes (manualmente), reaparece 2 minutos (120.000 ms) após ser fechado
  const handleManualClose = () => {
    setShowTooltip(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 120000);
  };

  const floatingWhatsappUrl = whatsappUrl(SITE_CONFIG.floatingWhatsappMessage);

  return (
    <aside
      aria-label="Atendimento rápido via WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none"
    >
      {/* Balão de Pop-up Minimalista com Superfície Escura Neutra */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="whatsapp-popup-tooltip"
            id="whatsapp-popup-tooltip"
            initial={shouldReduceMedia() ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMedia() ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMedia() ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="mb-2.5 w-[min(260px,calc(100vw-2rem))] bg-[#0B101D]/95 border border-white/[0.08] text-white rounded-xl px-4 py-3 shadow-xl backdrop-blur-md pointer-events-auto relative origin-bottom-right z-50 flex items-start justify-between gap-2.5"
          >
            <a
              href={floatingWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conversa no WhatsApp: Olá! Precisa de um site? Me fale sobre o seu projeto."
              className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium text-slate-300">
                  {isOnline ? 'Online agora' : 'Responderemos em breve'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                Olá! Precisa de um site? Me fale sobre o seu projeto.
              </p>
            </a>

            <button
              type="button"
              id="close-whatsapp-tooltip"
              onClick={handleManualClose}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 -mr-1 -mt-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              aria-label="Fechar mensagem de atendimento"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante Principal com Animação Sutil de Pulsação Constante */}
      <a
        id="floating-whatsapp-btn"
        href={floatingWhatsappUrl}
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
