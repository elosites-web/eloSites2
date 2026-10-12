import React, { useState } from 'react';
import {
  Target,
  Building2,
  Sparkles,
  Check,
  X,
  CreditCard,
  Percent,
  Split,
  Calendar,
  Calculator,
  ArrowRight,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, PAYMENT_CONDITIONS, whatsappUrl } from '../types';

interface ServiceCategory {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  includes: string[];
  scopeNote: string;
  excluded?: string[];
  ctaLabel: string;
  ctaId: string;
  ctaMessage: string;
}

const SERVICES: ServiceCategory[] = [
  {
    id: 'landing-page',
    badge: 'Foco em Conversão',
    title: 'Landing Page de Alta Conversão',
    description:
      'Página única estratégica e objetiva. Projetada para converter visitantes em clientes no WhatsApp, ideal para tráfego pago (Google/Meta Ads) e campanhas ativas.',
    icon: Target,
    includes: [
      'Estrutura estratégica de página única orientada a conversão',
      'Hero section com proposta de valor clara e CTA imediato',
      'Apresentação dos serviços ou produtos com diferenciais competitivos',
      'Gatilhos diretos e botões personalizados para o WhatsApp',
      'Depoimentos e prova social (quando fornecidos)',
      'FAQ estruturado com dúvidas frequentes dos seus clientes',
      'Layout 100% responsivo para smartphone, tablet e desktop',
      'SEO técnico on-page, metadados OpenGraph e favicon personalizado',
      'Publicação e testes completos na URL de produção',
    ],
    scopeNote:
      'O escopo exato de seções e conteúdo é definido de forma personalizada na proposta comercial.',
    excluded: [
      'Domínio próprio (.com.br / .com) — registro à parte em nome do cliente',
      'Criação de logotipo do zero (identidade visual)',
      'Páginas extras além do escopo de página única acordado',
    ],
    ctaLabel: 'Pedir proposta de Landing Page',
    ctaId: 'service-cta-landing-page',
    ctaMessage: SITE_CONFIG.landingPageWhatsappMessage,
  },
  {
    id: 'site-institucional',
    badge: 'Autoridade & Estrutura',
    title: 'Site Institucional Completo',
    description:
      'Presença corporativa sólida para empresas e profissionais liberais que necessitam transmitir autoridade, apresentar múltiplos serviços e atrair clientes qualificados.',
    icon: Building2,
    includes: [
      'Página inicial com navegação dedicada e apresentação corporativa',
      'Seção detalhada de serviços com especificações e benefícios',
      'Seção "Sobre" com história, valores e equipe/fundador',
      'Portfólio de cases, projetos realizados e clientes atendidos',
      'Prova social, depoimentos e selos de garantia/confiabilidade',
      'Formulário estruturado de cotação integrado ao WhatsApp',
      'Localização, mapa, dados de contato e canais de atendimento',
      'Layout responsivo de alta precisão técnica',
      'SEO técnico aprofundado para indexação no Google',
      'Publicação com certificado SSL e suporte à entrega',
    ],
    scopeNote:
      'O número de seções, páginas ou abas é dimensionado de acordo com a necessidade da sua empresa.',
    excluded: [
      'Domínio próprio — registro em conta e titularidade do cliente',
      'Hospedagem em servidor de terceiros com painéis legados',
      'Integrações com ERPs ou sistemas bancários complexos',
    ],
    ctaLabel: 'Pedir proposta de Site Institucional',
    ctaId: 'service-cta-institucional',
    ctaMessage: SITE_CONFIG.siteInstitucionalWhatsappMessage,
  },
  {
    id: 'projeto-personalizado',
    badge: 'Solução Sob Medida',
    title: 'Projeto Sob Medida / Redesign',
    description:
      'Para negócios com requisitos específicos: arquitetura multitela, catálogos interativos, redesign completo de site antigo lento ou fluxos avançados de agendamento.',
    icon: Sparkles,
    includes: [
      'Estrutura personalizada (multitelas dedicadas, catálogo ou SPA)',
      'Otimização radical de performance (nota 90+ no PageSpeed)',
      'Interações customizadas, calculadoras de orçamento ou simuladores',
      'Formulários com validação e exportação para WhatsApp ou e-mail',
      'Redesign de interface visual para modernização completa da marca',
      'SEO técnico estruturado com Schema.org JSON-LD',
      'Layout com design autoral exclusivo sem modelos prontos genéricos',
      'Suporte direto com o desenvolvedor durante todo o ciclo',
    ],
    scopeNote:
      'Orçamento específico dimensionado a partir da complexidade técnica e do prazo desejado.',
    excluded: [
      'Domínio próprio registrado em conta de terceiros',
      'Funcionalidades que fujam do escopo técnico aprovado',
    ],
    ctaLabel: 'Conversar sobre Projeto Sob Medida',
    ctaId: 'service-cta-personalizado',
    ctaMessage: SITE_CONFIG.personalizadoWhatsappMessage,
  },
];

interface ServicesSectionProps {
  onNavigateToOrcamento?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToOrcamento }) => {
  // Simulador interativo de pagamento (iniciando em R$ 650 conforme solicitado)
  const [simulatedValue, setSimulatedValue] = useState<number>(650);

  const discountValue = Math.round(simulatedValue * (1 - PAYMENT_CONDITIONS.cashDiscountPercent / 100));
  const pixSplitFirst = Math.round(simulatedValue * 0.5);
  const pixSplitSecond = simulatedValue - pixSplitFirst;
  const installment5x = (simulatedValue / 5).toFixed(2);
  const installment12xEst = ((simulatedValue * 1.15) / 12).toFixed(2);

  return (
    <section
      id="servicos"
      className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen flex flex-col justify-between"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-500/[0.07] blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/[0.07] blur-[130px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative w-full flex-1 flex flex-col justify-between">
        {/* Cabeçalho da Seção */}
        <div>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Formatos de Serviços & Condições Comerciais</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight">
              Formatos sob medida com pagamento flexível
            </h2>
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Cada projeto recebe um <strong>orçamento personalizado</strong> considerando escopo, seções, conteúdo e prazo. Sem mensalidades surpresa e com opções de parcelamento no cartão ou desconto à vista no PIX.
            </p>
          </div>

          {/* Grid dos 3 Serviços */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 min-w-0 items-stretch">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const ctaUrl = whatsappUrl(service.ctaMessage);

              return (
                <article
                  key={service.id}
                  className="surface-card relative rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between border border-white/[0.08] bg-[#0A0E17]/90 hover:border-indigo-500/35 transition-all duration-300 shadow-xl shadow-black/40"
                >
                  <div className="space-y-6">
                    {/* Topo do card */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-950/90 px-3 py-1 rounded-full border border-indigo-700/60 font-medium">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Escopo de entrega */}
                    <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        O que está incluso:
                      </span>
                      <div className="grid grid-cols-1 gap-2 text-sm text-slate-300">
                        {service.includes.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="text-xs sm:text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed rounded-lg border border-white/[0.06] bg-slate-950/60 p-3">
                      ℹ️ {service.scopeNote}
                    </p>

                    {service.excluded && (
                      <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Não incluso por padrão:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-400">
                          {service.excluded.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <X className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Orçamento Personalizado & CTA */}
                  <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                          Proposta Comercial
                        </span>
                        <span className="text-[11px] text-emerald-400 font-mono font-medium">
                          Orçamento Específico
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Definido por escopo, páginas e urgência. Pagamento facilitado em até 5x sem juros ou desconto no PIX.
                      </p>
                    </div>

                    <a
                      id={service.ctaId}
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-primary w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/25 min-h-12"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
                      <span>{service.ctaLabel}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* SEÇÃO DESTACADA: CONDIÇÕES DE PAGAMENTO ATUALIZADAS */}
          <div className="mt-14 sm:mt-20">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                Formas de Pagamento Transparentes
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Como funciona o pagamento na ēloSites
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Você escolhe a melhor modalidade financeira para o momento da sua empresa, com total segurança e clareza contratual.
              </p>
            </div>

            {/* 4 Blocos de Regras Comerciais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Regra 1: 50% Entrada + 50% Final */}
              <div className="p-5 rounded-2xl bg-[#0b101c] border border-white/[0.08] space-y-3 hover:border-indigo-400/40 transition-all shadow-md">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/90 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Split className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">50% Início + 50% Entrega</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  50% no momento da contratação para iniciar imediatamente o desenvolvimento e 50% restante após a entrega e aprovação final (via PIX).
                </p>
                <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-500/20">
                  Ideal para fluxo de caixa
                </div>
              </div>

              {/* Regra 2: 20% de Desconto à Vista */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-[#0b101c] border border-emerald-500/30 space-y-3 hover:border-emerald-400/50 transition-all shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Percent className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">20% de Desconto à Vista</h4>
                  <span className="text-[10px] font-bold uppercase bg-emerald-500 text-black px-2 py-0.5 rounded">
                    Maior economia
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Pagamento integral à vista no momento do fechamento garante 20% de desconto direto sobre o valor total do projeto orçado.
                </p>
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20">
                  Economize 1/5 do investimento
                </div>
              </div>

              {/* Regra 3: Cartão até 5x sem juros */}
              <div className="p-5 rounded-2xl bg-[#0b101c] border border-white/[0.08] space-y-3 hover:border-indigo-400/40 transition-all shadow-md">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/90 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Até 5x Sem Juros no Cartão</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Aceitamos cartão de crédito em até 5 vezes sem nenhum juro para você (sendo 1 entrada + 4 parcelas mensais fixas).
                </p>
                <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-500/20">
                  1 Entrada + 4 Parcelas Fixas
                </div>
              </div>

              {/* Regra 4: Cartão de 6x a 12x */}
              <div className="p-5 rounded-2xl bg-[#0b101c] border border-white/[0.08] space-y-3 hover:border-indigo-400/40 transition-all shadow-md">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/90 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">De 6x até 12x no Cartão</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Para parcelamentos mais longos, viabilizamos de 6x até 12x no cartão de crédito, com repasse das taxas de juros da operadora para o cliente.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-white/[0.05]">
                  Parcelas mínimas mensais
                </div>
              </div>
            </div>

            {/* SIMULADOR INTERATIVO DE CONDIÇÕES */}
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-white/[0.09] shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="space-y-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase">
                    <Calculator className="w-4 h-4" />
                    <span>Simulador de Condições de Pagamento</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    Simule as formas de pagamento com base no orçamento
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Arraste o controle ou escolha um valor de referência para visualizar a economia à vista e as parcelas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center">
                  {[650, 1000, 1500, 2200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSimulatedValue(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        simulatedValue === preset
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      R$ {preset.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider de Valor */}
              <div className="py-6 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Valor orçado simulado:</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-300">
                    R$ {simulatedValue.toLocaleString('pt-BR')},00
                  </span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="3500"
                  step="50"
                  value={simulatedValue}
                  onChange={(e) => setSimulatedValue(Number(e.target.value))}
                  aria-label="Simular valor do orçamento"
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>R$ 600</span>
                  <span>R$ 2.000</span>
                  <span>R$ 3.500</span>
                </div>
              </div>

              {/* Grid de Resultados da Simulação */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {/* Resultado À Vista */}
                <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                    ⚡ À Vista (20% OFF)
                  </span>
                  <p className="text-2xl font-bold font-mono text-emerald-300">
                    R$ {discountValue.toLocaleString('pt-BR')},00
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Economia imediata de <strong className="text-white">R$ {(simulatedValue - discountValue).toLocaleString('pt-BR')}</strong> via PIX
                  </p>
                </div>

                {/* Resultado 50% / 50% */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08] space-y-1">
                  <span className="text-xs font-semibold text-indigo-400 uppercase">
                    💎 50% Início + 50% Entrega
                  </span>
                  <p className="text-2xl font-bold font-mono text-white">
                    2x R$ {pixSplitFirst.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    1ª parcela na contratação e 2ª na entrega final (PIX)
                  </p>
                </div>

                {/* Resultado Cartão 5x */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08] space-y-1">
                  <span className="text-xs font-semibold text-indigo-400 uppercase">
                    💳 Cartão até 5x Sem Juros
                  </span>
                  <p className="text-2xl font-bold font-mono text-white">
                    5x R$ {installment5x}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    1 entrada + 4 parcelas no cartão sem nenhum acréscimo
                  </p>
                </div>
              </div>

              {/* Ação direta da simulação */}
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  * Valores calculados para fins de demonstração. Cada proposta oficial detalha prazos e entregáveis específicos.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {onNavigateToOrcamento && (
                    <button
                      type="button"
                      onClick={onNavigateToOrcamento}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/40 shadow-lg shadow-indigo-500/25 transition-all"
                    >
                      <span>Montar Briefing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href={whatsappUrl(
                      `Olá! Simulei uma condição de pagamento para o meu site (aproximadamente R$ ${simulatedValue},00) e gostaria de receber um orçamento oficial com escopo detalhado.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/30 transition-all shadow-lg shadow-emerald-950/40"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Pedir Proposta com Esta Condição</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé institucional com aviso de hospedagem e domínio */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto rounded-2xl border border-white/[0.07] bg-slate-950/50 p-5 sm:p-6 space-y-2 text-xs sm:text-sm text-slate-400 leading-relaxed text-center">
          <p>
            <ShieldCheck className="w-4 h-4 text-indigo-400 inline-block mr-1.5" />
            A entrega padrão é o site publicado e testado na infraestrutura Netlify. O registro de domínio personalizado (.com.br, .com) é realizado diretamente em nome e conta do cliente para garantir 100% de titularidade.
          </p>
        </div>
      </div>
    </section>
  );
};
