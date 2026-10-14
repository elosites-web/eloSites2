import React from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { NAVIGATION_ITEMS, SITE_CONFIG, whatsappUrl } from '../types';
import { Mail, ArrowUp } from 'lucide-react';

import { ScreenId } from '../types';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onSelectScreen?: (screen: ScreenId) => void;
  currentScreen?: ScreenId;
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onSelectScreen,
  currentScreen,
  isHighContrast,
  onToggleHighContrast,
}) => {
  const currentYear = new Date().getFullYear();

  const footerWhatsappUrl = whatsappUrl(SITE_CONFIG.footerWhatsappMessage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSelectScreen) onSelectScreen('inicio');
  };

  return (
    <footer className="bg-[#060912]/85 backdrop-blur-[4px] border-t border-slate-800/90 text-slate-400 text-sm pb-[3px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Marca e Posicionamento */}
          <div className="md:col-span-5 space-y-4">
            <EloLogo size="md" />
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm">
              Criação de sites profissionais com SEO técnico e foco em conversão para pequenos negócios e profissionais liberais. Arquitetura moderna, código limpo e atendimento direto.
            </p>
            <div className="flex flex-col items-start gap-2.5 pt-2">
              <a
                id="footer-whatsapp-link"
                href={footerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-300/40 text-white shadow-lg shadow-emerald-950/40 hover:shadow-[0_0_22px_rgba(37,211,102,0.65)] active:shadow-[0_0_30px_rgba(37,211,102,0.85)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-xs font-semibold tracking-wide"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span className="text-white drop-shadow-sm text-center">Falar no Whatsapp</span>
              </a>

              {SITE_CONFIG.email && (
                <a
                  id="footer-email-link"
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center justify-center text-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all text-xs font-medium"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-center">{SITE_CONFIG.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {NAVIGATION_ITEMS.map((item) => {
                const getScreenFromHref = (href: string): ScreenId => {
                  if (href.includes('portfolio')) return 'portfolio';
                  if (href.includes('servico')) return 'servicos';
                  if (href.includes('processo') || href.includes('como-funciona')) return 'processo';
                  if (href.includes('diferencia')) return 'diferenciais';
                  if (href.includes('briefing') || href.includes('orcamento')) return 'orcamento';
                  if (href.includes('faq')) return 'faq';
                  if (href.includes('contato')) return 'contato';
                  return 'inicio';
                };

                const screenId = getScreenFromHref(item.href);
                const isActive = currentScreen === screenId;

                return (
                  <li key={`footer-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectScreen) {
                          onSelectScreen(screenId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`text-left transition-colors relative flex items-center gap-2 py-0.5 ${
                        isActive
                          ? 'text-indigo-300 font-semibold'
                          : 'text-slate-400 hover:text-indigo-300'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="footer-active-nav-dot"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] shrink-0"
                        />
                      )}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Segmentos e Foco */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Especialidades
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sites institucionais e landing pages desenvolvidos especificamente para prestadores de serviços:
              Personal trainers, advogados, salões de beleza, barbearias, clínicas e profissionais autônomos.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Código limpo • Sem templates prontos genéricos</span>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright, Botão Voltar ao Topo e Políticas */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {currentYear} ēloSites. Todos os direitos reservados.</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              Política de Privacidade
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              Termos de Uso
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center text-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Voltar ao início da página"
          >
            <span className="text-center">Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
