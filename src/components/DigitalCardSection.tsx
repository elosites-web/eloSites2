import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Mail, Phone, ArrowLeft, X, Globe, MessageSquare } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { BiReveal } from './BiReveal';

interface DigitalCardSectionProps {
  onNavigateHome?: () => void;
}

/**
 * Cartão digital do fundador Everton Lopes, exibido na tela "FAQ & Contato" logo após o bloco de Contato.
 * Permite também visualização em tela cheia interativa sem sair da aplicação, com botão "Fechar"
 * que ancora diretamente para a página inicial (Home).
 */
export const DigitalCardSection: React.FC<DigitalCardSectionProps> = ({ onNavigateHome }) => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const cardWhatsappUrl = whatsappUrl(
    'Olá, Everton! Vi seu cartão da ēloSites e quero um orçamento de site.'
  );
  const talkWhatsappUrl = whatsappUrl(
    'Olá, Everton! Quero conversar sobre um site profissional para o meu negócio.'
  );
  const phoneHref = `tel:+${SITE_CONFIG.whatsappNumber}`;

  // Fecha o cartão em tela cheia e ancora diretamente para a página inicial (Home)
  const handleCloseToHome = useCallback(() => {
    setIsFullscreenOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = 'home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigateHome]);

  // Tecla Escape para fechar a visualização em tela cheia e ir para a Home
  useEffect(() => {
    if (!isFullscreenOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseToHome();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen, handleCloseToHome]);

  // Ao montar na tela FAQ, se o hash apontar para o cartão, faz a rolagem suave centralizada
  useEffect(() => {
    const raw = window.location.hash.replace('#', '');
    if (
      raw === 'cartao-digital' ||
      raw === 'cartao' ||
      raw === 'cartao-visitas' ||
      raw === 'cartao-de-visitas'
    ) {
      const scrollTimer = setTimeout(() => {
        const el =
          document.getElementById('cartao-de-visitas') ||
          document.getElementById('cartao-digital');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
      return () => clearTimeout(scrollTimer);
    }
  }, []);

  return (
    <section
      id="cartao-digital"
      aria-labelledby="cartao-digital-title"
      className="section-auto-contain pt-4 pb-16 sm:pb-20 bg-[#050814] relative overflow-x-clip scroll-mt-24"
    >
      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <BiReveal direction="up">
          <div
            id="cartao-de-visitas"
            className="max-w-md mx-auto rounded-3xl p-6 sm:p-8 bg-[#070b1a] border border-indigo-500/20 shadow-2xl shadow-black/60 flex flex-col items-center text-center gap-5 scroll-mt-24"
          >
            <div className="rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.35)]">
              <img
                src="/cartao/eu.webp"
                alt="Everton Lopes, fundador da ēloSites"
                width={132}
                height={132}
                loading="lazy"
                decoding="async"
                className="block w-[132px] h-[132px] rounded-full object-cover bg-[#111a3e]"
              />
            </div>

            <div>
              <h2
                id="cartao-digital-title"
                className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
              >
                Everton Lopes
              </h2>
              <p className="mt-1.5 text-sm sm:text-base font-semibold text-blue-300">
                Fundador da ēloSites
              </p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                Presença digital estratégica para pequenos negócios e profissionais liberais.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <a
                href={cardWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[52px] px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 shadow-lg shadow-blue-900/30 transition cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                Pedir orçamento no WhatsApp
              </a>
              <a
                href={talkWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[48px] px-4 rounded-xl text-sm font-semibold text-slate-100 bg-[#090e23] border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-400/50 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span>Conversar com o fundador</span>
              </a>
              <a
                href={phoneHref}
                className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm text-slate-100 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm text-slate-100 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors break-all"
              >
                <Mail className="w-5 h-5 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.email}</span>
              </a>

              {/* Botão para abrir o cartão de visitas em tela cheia */}
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
                className="flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl text-sm font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer"
              >
                <span>Abrir cartão em tela cheia</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </BiReveal>
      </div>

      {/* Modal Interativo de Cartão Digital em Tela Cheia */}
      {isFullscreenOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullscreen-card-title"
          className="fixed inset-0 z-[120] bg-[#050814]/95 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6"
        >
          {/* Efeitos de iluminação de fundo */}
          <div
            className="fixed top-[-10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="fixed bottom-[-10%] left-[-10%] w-[440px] h-[440px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Botão Fechar Flutuante no Topo Direito — Ancorando diretamente para a Home */}
          <button
            type="button"
            onClick={handleCloseToHome}
            aria-label="Fechar cartão e ir para a página inicial Home"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[130] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#090e23]/90 hover:bg-blue-600/25 text-slate-100 hover:text-white border border-blue-500/40 hover:border-blue-400 font-semibold text-sm backdrop-blur-md shadow-2xl transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Fechar</span>
          </button>

          {/* Container Principal do Cartão em Tela Cheia */}
          <div className="relative z-10 w-full max-w-[440px] my-auto py-8 px-5 sm:px-8 flex flex-col items-center text-center gap-5 bg-[#070b1a] border border-blue-500/30 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
            {/* Logotipo */}
            <img
              src="/cartao/logo.webp"
              alt="ēloSites"
              width={150}
              height={37}
              className="w-[150px] h-auto"
            />

            {/* Foto Circular com Halo e Anel Gradiente */}
            <div className="relative w-[140px] h-[140px] flex-none">
              <div
                className="absolute inset-[-14px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.45),rgba(59,130,246,0)_68%)] animate-pulse"
                aria-hidden="true"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-600 to-indigo-500 p-1">
                <img
                  src="/cartao/eu.webp"
                  alt="Everton Lopes, fundador da ēloSites"
                  width={132}
                  height={132}
                  className="w-full h-full rounded-full object-cover bg-[#111a3e]"
                />
              </div>
            </div>

            {/* Informações de Everton Lopes */}
            <div className="space-y-1.5">
              <h1
                id="fullscreen-card-title"
                className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
              >
                Everton Lopes
              </h1>
              <p className="text-sm sm:text-base font-semibold text-blue-300">
                Fundador da ēloSites
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-[320px] mx-auto leading-relaxed">
                Presença digital estratégica para pequenos negócios e profissionais liberais.
              </p>
            </div>

            {/* Pilha de Botões de Ação */}
            <div className="w-full flex flex-col gap-2.5">
              <a
                href={cardWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[52px] px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 shadow-lg shadow-blue-900/30 transition cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                Pedir orçamento no WhatsApp
              </a>

              <a
                href={talkWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[48px] px-4 rounded-xl text-sm font-semibold text-slate-100 bg-[#090e23] border border-blue-500/40 hover:bg-blue-500/15 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                Conversar com o fundador
              </a>

              {/* Botão de Fechar e ir para a Home dentro do próprio cartão */}
              <button
                type="button"
                onClick={handleCloseToHome}
                className="flex items-center justify-center gap-2.5 min-h-[48px] px-4 rounded-xl text-sm font-bold text-[#050814] bg-[#f1f5f9] hover:bg-white hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#050814]" aria-hidden="true" />
                <span>Fechar e ir para a Home</span>
              </button>
            </div>

            {/* Linhas de Contato Direto */}
            <div className="w-full flex flex-col gap-2 pt-1 text-left">
              <a
                href={phoneHref}
                className="flex items-center gap-3 min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm text-slate-200 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm text-slate-200 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <button
                type="button"
                onClick={handleCloseToHome}
                className="flex items-center gap-3 min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm text-slate-200 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors text-left w-full cursor-pointer"
              >
                <Globe className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span>elosites.ia.br (Ir para a Home)</span>
              </button>
            </div>

            {/* Bloco QR Code */}
            <div className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-[#090e23] border border-blue-500/20 text-left">
              <button
                type="button"
                onClick={handleCloseToHome}
                title="Ir para a página inicial Home"
                aria-label="Abrir elosites.ia.br na página inicial Home"
                className="relative block w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-white p-1.5 overflow-hidden cursor-pointer group"
              >
                <svg
                  viewBox="-2 -2 29 29"
                  role="img"
                  aria-label="QR code para o site elosites.ia.br"
                  shapeRendering="crispEdges"
                  className="w-full h-full block"
                >
                  <path
                    fill="#050814"
                    d="M0 0h7v1h-7zM8 0h2v1h-2zM11 0h1v1h-1zM14 0h3v1h-3zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h3v1h-3zM13 1h2v1h-2zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM9 2h2v1h-2zM14 2h1v1h-1zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h1v1h-1zM13 3h2v1h-2zM16 3h1v1h-1zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM13 4h3v1h-3zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h3v1h-3zM13 5h2v1h-2zM16 5h1v1h-1zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM8 7h1v1h-1zM10 7h3v1h-3zM14 7h1v1h-1zM16 7h1v1h-1zM0 8h1v1h-1zM4 8h1v1h-1zM6 8h3v1h-3zM10 8h2v1h-2zM14 8h1v1h-1zM16 8h6v1h-6zM24 8h1v1h-1zM1 9h1v1h-1zM5 9h1v1h-1zM8 9h2v1h-2zM12 9h1v1h-1zM14 9h3v1h-3zM20 9h2v1h-2zM23 9h1v1h-1zM1 10h1v1h-1zM4 10h1v1h-1zM6 10h2v1h-2zM13 10h3v1h-3zM18 10h2v1h-2zM21 10h2v1h-2zM0 11h1v1h-1zM2 11h1v1h-1zM8 11h2v1h-2zM12 11h1v1h-1zM15 11h1v1h-1zM17 11h1v1h-1zM19 11h1v1h-1zM22 11h2v1h-2zM1 12h1v1h-1zM4 12h3v1h-3zM12 12h1v1h-1zM17 12h3v1h-3zM21 12h4v1h-4zM0 13h1v1h-1zM2 13h2v1h-2zM5 13h1v1h-1zM7 13h3v1h-3zM13 13h4v1h-4zM20 13h1v1h-1zM23 13h1v1h-1zM2 14h2v1h-2zM5 14h3v1h-3zM9 14h2v1h-2zM13 14h1v1h-1zM15 14h2v1h-2zM18 14h5v1h-5zM4 15h2v1h-2zM8 15h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM15 15h1v1h-1zM18 15h3v1h-3zM22 15h2v1h-2zM0 16h2v1h-2zM4 16h1v1h-1zM6 16h1v1h-1zM10 16h2v1h-2zM16 16h7v1h-7zM8 17h1v1h-1zM12 17h2v1h-2zM15 17h2v1h-2zM20 17h1v1h-1zM0 18h7v1h-7zM8 18h1v1h-1zM10 18h4v1h-4zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM0 19h1v1h-1zM6 19h1v1h-1zM9 19h3v1h-3zM16 19h1v1h-1zM20 19h5v1h-5zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM8 20h1v1h-1zM10 20h1v1h-1zM12 20h3v1h-3zM16 20h9v1h-9zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM10 21h1v1h-1zM13 21h3v1h-3zM17 21h3v1h-3zM22 21h3v1h-3zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM9 22h2v1h-2zM15 22h1v1h-1zM18 22h1v1h-1zM21 22h1v1h-1zM23 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM12 23h1v1h-1zM15 23h1v1h-1zM17 23h1v1h-1zM19 23h5v1h-5zM0 24h7v1h-7zM8 24h8v1h-8zM17 24h1v1h-1zM22 24h3v1h-3z"
                  />
                </svg>
              </button>
              <div>
                <h2 className="font-display text-sm sm:text-base font-bold text-white">
                  Conheça o site
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Toque no QR code ou no botão acima para ir para a Home.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
