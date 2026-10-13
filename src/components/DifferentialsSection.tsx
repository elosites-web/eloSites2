import React, { useState, useEffect } from 'react';
import {
  Zap,
  User,
  Server,
  TrendingUp,
  CheckCircle2,
  Flame,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  projectTitle: string;
  category: string;
}

interface DifferentialsSectionProps {
  onNavigateToPortfolio?: () => void;
}

export const DifferentialsSection: React.FC<DifferentialsSectionProps> = ({
  onNavigateToPortfolio,
}) => {
  const differentials: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    isWhatsApp?: boolean;
    promise?: string;
  }[] = [
    {
      title: 'Código limpo & alta performance',
      description:
        'Desenvolvimento autoral, leve e otimizado para carregamento instantâneo. Sem temas genéricos ou plugins pesados que deixam o site lento.',
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

  // Dados reais dos clientes fornecidos
  const testimonials: Testimonial[] = [
    {
      name: 'João Victor',
      role: 'Personal Trainer',
      text: 'Gostei muito do resultado do site! Ficou profissional, moderno e com a identidade do meu trabalho como personal trainer. Agora consigo apresentar melhor meus serviços e transmitir mais confiança para quem está buscando um profissional para acompanhar seus treinos. O resultado ficou muito bom!',
      projectTitle: 'JV Salvaia Personal Trainer',
      category: 'Landing Page',
    },
    {
      name: 'Jonathan Toledo',
      role: 'Proprietário da Toledo Segurança',
      text: 'O desenvolvimento do site da Toledo Segurança ficou excelente! O projeto transmitiu a seriedade e o profissionalismo que eu queria passar para os nossos clientes. Ter um site próprio faz diferença na apresentação da empresa e fortalece nossa presença na internet. Fiquei muito satisfeito com o resultado e com o trabalho realizado.',
      projectTitle: 'Toledo Segurança & Vigilância',
      category: 'Site Institucional',
    },
    {
      name: 'Renato Becala',
      role: 'Landing page para evento de fim de ano',
      text: 'A landing page para o nosso evento de fim de ano ficou muito bacana! A proposta era ter uma página que reunisse as principais informações do evento de forma organizada e atrativa, e o resultado atendeu muito bem à ideia. Ficou uma apresentação moderna, prática e com a cara do nosso encontro. Com certeza fez o evento ter uma presença digital ainda mais especial!',
      projectTitle: 'Duelo de Fim de Ano — Badem vs Becala',
      category: 'Landing Page',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Suporte a teclado no carrossel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevTestimonial();
      } else if (e.key === 'ArrowRight') {
        handleNextTestimonial();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentT = testimonials[activeTestimonial];

  return (
    <section
      id="diferenciais"
      className="py-20 sm:py-28 bg-[#090D16]/80 relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />

      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-500/[0.06] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/[0.06] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x">
        {/* Cabeçalho da Seção de Diferenciais */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Diferenciais Estratégicos</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight">
            O que muda quando o site é feito para o seu negócio
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Menos agência genérica. Mais presença profissional, conversa direta e resultado.
          </p>
        </div>

        {/* Grade de 6 Cards de Diferenciais com Gradiente Suave e Hover Lift Pronunciado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`relative rounded-2xl p-[1px] bg-gradient-to-b transition-all duration-300 group ${
                  item.isWhatsApp
                    ? 'from-emerald-400/40 via-emerald-500/15 to-white/[0.04] hover:from-emerald-400/75 hover:via-emerald-400/30 hover:to-white/[0.1] hover:shadow-[0_22px_45px_-12px_rgba(37,211,102,0.3)]'
                    : 'from-indigo-400/30 via-purple-500/15 to-white/[0.04] hover:from-indigo-400/65 hover:via-purple-400/35 hover:to-white/[0.1] hover:shadow-[0_22px_45px_-12px_rgba(99,102,241,0.28)]'
                }`}
              >
                <article
                  className="h-full w-full rounded-2xl p-6 sm:p-7 bg-[#0B101D]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-3.5 group-hover:bg-[#0E1424]/98"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          item.isWhatsApp
                            ? 'bg-[#25D366] text-white shadow-lg shadow-emerald-950/40 group-hover:shadow-[0_0_20px_rgba(37,211,102,0.7)] group-hover:scale-110'
                            : 'bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 shadow-md group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] group-hover:border-indigo-400/60 group-hover:scale-110'
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
                    <span className="font-medium text-slate-300">Padrão ēloSites</span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* SEÇÃO: DEPOIMENTOS DE CLIENTES COM CARROSSEL RESPONSIVO */}
        <div className="mt-24 sm:mt-32 pt-16 border-t border-white/[0.08]">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
              <Quote className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>Depoimentos de Clientes</span>
            </div>
            <h3 className="font-display text-2.5xl sm:text-3.5xl lg:text-4xl font-bold tracking-[-0.03em] text-white text-balance leading-tight">
              O que dizem quem colocou o site no ar conosco
            </h3>
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
              Projetos reais entregues para profissionais e empresas, validados diretamente por seus fundadores.
            </p>
          </div>

          {/* Carrossel Responsivo de Depoimentos */}
          <div
            className="relative max-w-4xl mx-auto"
            role="region"
            aria-roledescription="carousel"
            aria-label="Carrossel de Depoimentos de Clientes"
          >
            {/* Card Principal do Depoimento Ativo (Sem telas repetidas, foco total no depoimento e link para o portfólio) */}
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/35 via-purple-500/20 to-white/[0.06] shadow-2xl shadow-indigo-950/40">
              <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#0B101D]/95 backdrop-blur-xl">
                {/* Header superior do depoimento */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-5 border-b border-white/[0.08]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Depoimento Real de Cliente • {currentT.category}</span>
                  </div>

                  {/* Contador de Slides */}
                  <div className="font-mono text-xs text-slate-400 px-3 py-1 rounded-lg bg-slate-900 border border-white/[0.06]">
                    0{activeTestimonial + 1} / 0{testimonials.length}
                  </div>
                </div>

                {/* Ícone de Aspas e Citação */}
                <Quote className="w-10 h-10 text-indigo-400/40 mb-4" aria-hidden="true" />
                <blockquote className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal leading-relaxed italic mb-8 sm:mb-10">
                  "{currentT.text}"
                </blockquote>

                {/* Identificação do Cliente (Nome, Quem é / Cargo) e Link para Ver no Portfólio */}
                <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold font-mono text-base shadow-inner shrink-0">
                      {getInitials(currentT.name)}
                    </div>
                    <div>
                      <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        {currentT.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                        {currentT.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Projeto: {currentT.projectTitle}
                      </p>
                    </div>
                  </div>

                  {/* Link 'Ver no portfólio' */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToPortfolio) {
                        onNavigateToPortfolio();
                      } else {
                        window.location.hash = 'portfolio';
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-200 hover:text-white border border-indigo-500/30 hover:border-indigo-400/60 transition-all font-semibold text-xs sm:text-sm group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] shrink-0"
                  >
                    <span>Ver projeto no portfólio</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Controles de Navegação do Carrossel */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {/* Botão Anterior */}
              <button
                type="button"
                onClick={handlePrevTestimonial}
                aria-label="Depoimento anterior"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-lg hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Indicadores de Paginação / Dots */}
              <div className="flex items-center gap-2.5" role="tablist">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.name}
                    type="button"
                    role="tab"
                    aria-selected={activeTestimonial === idx}
                    aria-label={`Ir para depoimento de ${t.name}`}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeTestimonial === idx
                        ? 'w-8 h-2.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                        : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              {/* Botão Próximo */}
              <button
                type="button"
                onClick={handleNextTestimonial}
                aria-label="Próximo depoimento"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.08] shadow-lg hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
