import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
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
      {/* Balão de Pop-up remodelado no estilo conversa com bico indicador para o botão flutuante */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="whatsapp-popup-tooltip"
            id="whatsapp-popup-tooltip"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.2, ease: 'easeOut' } }}
            transition={{
              opacity: { duration: 0.38, ease: [0.3, 0, 0.2, 1] },
              y: { duration: 0.45, ease: [0.22, 1.15, 0.36, 1] },
              scale: { duration: 0.42, ease: [0.22, 1.08, 0.36, 1] },
            }}
            className="mb-3.5 w-[min(285px,calc(100vw-2rem))] bg-[#0B101D]/98 border border-indigo-500/35 text-white rounded-2xl p-4 shadow-2xl shadow-black/90 backdrop-blur-xl pointer-events-auto relative origin-bottom-right z-50 ring-1 ring-white/[0.08]"
          >
            {/* Ponta / Bico do balão de fala apontando para o botão flutuante */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0B101D] border-r border-b border-indigo-500/35 rotate-45 pointer-events-none" />

            {/* Cabeçalho do balão com avatar, status online e botão de fechar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-indigo-400/30">
                    ēlo
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    {isOnline ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#0B101D]" />
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border border-[#0B101D]" />
                    )}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white tracking-wide">ēloSites</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium leading-none">
                      Oficial
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                    {isOnline ? 'Online agora' : 'Responderemos em breve'}
                  </p>
                </div>
              </div>

              {/* Botão de Fechar */}
              <button
                type="button"
                id="close-whatsapp-tooltip"
                onClick={handleManualClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
                aria-label="Fechar mensagem de atendimento"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corpo da Mensagem Remodelado: Balão de conversa limpo e objetivo */}
            <a
              href={floatingWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conversa no WhatsApp: Olá! Precisa de um site? Me fale sobre o seu projeto."
              className="block group/balloon transition-all cursor-pointer"
            >
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/25 group-hover/balloon:border-indigo-400/60 group-hover/balloon:bg-slate-800/90 text-slate-100 shadow-inner transition-all">
                <p className="font-bold text-white text-[13px] leading-snug group-hover/balloon:text-indigo-200 transition-colors">
                  Olá! Precisa de um site?
                </p>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                  Me fale sobre o seu projeto.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-indigo-300/90 font-medium">
                  <span className="text-slate-400 group-hover/balloon:text-slate-200 transition-colors">
                    Fale no WhatsApp
                  </span>
                  <span className="text-emerald-400 font-bold group-hover/balloon:translate-x-0.5 transition-transform flex items-center gap-1">
                    responder →
                  </span>
                </div>
              </div>
            </a>
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
