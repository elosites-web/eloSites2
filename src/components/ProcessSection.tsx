import React from 'react';
import { MessageSquare, Layers, Code2, Globe2, UserCheck, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Conversa inicial',
      description:
        'Conversa inicial sobre o negócio: o que você oferece, para quem e o que o site precisa gerar.',
      icon: MessageSquare,
    },
    {
      number: '02',
      title: 'Conteúdos e identidade',
      description:
        'Reunião de conteúdos, fotos e identidade. Organizamos o material para o site falar a língua do seu cliente.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Desenvolvimento e revisão',
      description:
        'Desenvolvimento rápido com auxílio de IA e revisão humana em cada detalhe. Nada vai ao ar sem olhar atento.',
      icon: Code2,
    },
    {
      number: '04',
      title: 'Site publicado',
      description:
        'Site publicado na URL do Netlify — essa é a entrega padrão. Domínio personalizado não está incluso. Hospedagem ou migração para outro provedor é orçada à parte.',
      icon: Globe2,
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-24 sm:py-32 bg-[#090D16]/70 backdrop-blur-[1px] relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent pointer-events-none" />
      <div className="page-shell page-x relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs font-semibold uppercase">
            <span>Como funciona</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Quatro etapas. Cada detalhe com revisão humana.
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            O processo é direto e acompanhado de perto. Usamos inteligência artificial
            para ganhar velocidade — mas o site nunca é entregue de forma totalmente automática.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative min-w-0">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl p-[1px] bg-gradient-to-b from-indigo-400/30 via-white/[0.08] to-transparent hover:from-indigo-400/70 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300 group"
              >
                <article
                  className="h-full w-full rounded-2xl p-6 sm:p-7 bg-[#0B101D]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-indigo-500/15"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-400/30 px-3 py-1 rounded-lg group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] group-hover:border-indigo-400/60 transition-all">
                        {step.number}
                      </span>
                      <div className="w-11 h-11 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 group-hover:shadow-[0_0_18px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3 group-hover:text-indigo-100 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-slate-900/45 border border-white/[0.07] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-400/20 flex items-center justify-center text-indigo-300 shrink-0">
            <UserCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span>Revisão humana em cada detalhe</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              A IA acelera o desenvolvimento. Quem decide o tom, a estrutura, o texto e
              o acabamento é uma pessoa — do primeiro rascunho até o site no ar.
            </p>
          </div>
        </div>

        {/* CTA Contextual do Processo */}
        <div className="mt-12 flex items-center justify-center">
          <a
            id="processo-cta-whatsapp"
            href={whatsappUrl(SITE_CONFIG.processoWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary inline-flex items-center justify-center text-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
            <span>Tirar dúvidas sobre o processo no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
