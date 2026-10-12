import React from 'react';
import { Zap, User, Server, TrendingUp, CheckCircle2, Flame, LucideIcon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const DifferentialsSection: React.FC = () => {
  const differentials: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    isWhatsApp?: boolean;
    promise?: string;
  }[] = [
    {
      title: 'Entrega em dias, não em meses',
      description:
        'Processo enxuto para colocar o site no ar com agilidade. Sem prometer prazo absoluto — cada projeto tem o ritmo do conteúdo e da revisão.',
      icon: Zap,
    },
    {
      title: 'Trabalho direto com o fundador',
      description:
        'Você conversa com quem desenha e desenvolve o site. Sem equipe inventada, sem intermediários e sem terceirização.',
      icon: User,
    },
    {
      title: 'Tecnologia moderna e publicação estável',
      description:
        'Stack atual, código organizado e publicação estável na URL do Netlify. Domínio personalizado não está incluso: se quiser um, o registro fica na sua conta e o pagamento é à parte.',
      icon: Server,
    },
    {
      title: 'Foco em conversão',
      description:
        'Cada seção existe para um motivo comercial: apresentar o serviço com clareza e levar o visitante até o contato.',
      icon: TrendingUp,
    },
    {
      title: 'Mais contexto antes da conversa',
      description:
        'O site apresenta seus serviços, explica seus diferenciais e reúne as informações que o cliente precisa para conhecer melhor seu negócio antes de entrar em contato. Com o WhatsApp integrado, fica mais fácil dar o próximo passo.',
      icon: Flame,
      promise:
        'O site apoia sua divulgação. Você continua responsável por atrair pessoas, atender os contatos e conduzir as vendas.',
    },
    {
      title: 'WhatsApp em primeiro lugar',
      description:
        'Quando faz sentido para o negócio, o site é pensado para gerar conversa no WhatsApp — com botões no momento certo e mensagens prontas.',
      icon: WhatsAppIcon,
      isWhatsApp: true,
    },
  ];

  return (
    <section
      id="diferenciais"
      className="py-24 sm:py-32 bg-[#090D16]/80 relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs font-semibold uppercase">
            <span>Diferenciais</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            O que muda quando o site é feito para o seu negócio
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Menos agência genérica. Mais presença profissional, conversa direta e resultado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-b transition-all duration-300 group ${
                  item.isWhatsApp
                    ? 'from-emerald-400/50 via-indigo-500/20 to-white/[0.05] hover:from-emerald-400/80 hover:shadow-[0_0_25px_rgba(37,211,102,0.25)]'
                    : 'from-indigo-400/35 via-white/[0.08] to-transparent hover:from-indigo-400/70 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                }`}
              >
                <article
                  className="h-full w-full rounded-2xl p-6 sm:p-7 bg-[#0B101D]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-indigo-500/15"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          item.isWhatsApp
                            ? 'bg-[#25D366] text-white shadow-lg shadow-emerald-950/40 group-hover:shadow-[0_0_20px_rgba(37,211,102,0.7)] group-hover:scale-105'
                            : 'bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 shadow-md group-hover:shadow-[0_0_18px_rgba(99,102,241,0.5)] group-hover:border-indigo-400/60 group-hover:scale-105'
                        }`}
                      >
                        {item.isWhatsApp ? (
                          <WhatsAppIcon className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-indigo-300 transition-colors">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-white mb-2.5 group-hover:text-indigo-100 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                    {item.promise && (
                      <p className="mt-3.5 flex items-start gap-2 text-sm text-indigo-200/95 leading-relaxed bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item.promise}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-6 pt-3.5 border-t border-white/[0.08] flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                    <span className="font-medium">Padrão ēloSites</span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
