import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle,
  Maximize2,
  X,
  Monitor,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';

export interface PortfolioProjectData {
  id: string;
  badge: string;
  status: string;
  title: string;
  category: 'landing' | 'institutional';
  challenge: string;
  solution: string;
  tags: string[];
  urlLabel: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  features: string[];
  resultsNote: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProjectData[] = [
  {
    id: 'jv-salvaia',
    badge: 'Landing page de alta conversão',
    status: 'Publicado & Ativo',
    title: 'JV Salvaia Personal Trainer',
    category: 'landing',
    challenge:
      'Personal trainer atuante em treino presencial, consultoria online e avaliação física. Necessitava de uma landing page de alta conversão para transformar visitantes de tráfego pago (Instagram e Facebook Ads) em mensagens imediatas no WhatsApp.',
    solution:
      'Desenvolvimento de landing page ágil, com botões de WhatsApp parametrizados para cada modalidade de treino, galeria de treinos, tabela de benefícios e prova social destacada.',
    tags: ['Treino Presencial', 'Consultoria Online', 'Avaliação Física', 'Foco em Tráfego Pago'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    desktopImage: '/portifolio-jvsalvaia-desktop.webp',
    mobileImage: '/portifolio-jvsalvaia-mobile.webp',
    features: [
      'Gatilho direto para WhatsApp em cada plano',
      'Layout 100% responsivo para smartphone',
      'Tempo de carregamento ultrarrápido (< 1.2s)',
    ],
    resultsNote: 'Leads direcionados com mensagem específica do serviço de interesse.',
  },
  {
    id: 'toledo-seguranca',
    badge: 'Site institucional corporativo',
    status: 'Publicado & Ativo',
    title: 'Toledo Segurança & Vigilância',
    category: 'institutional',
    challenge:
      'Empresa especializada em segurança para eventos, portaria terceirizada e rondas preventivas em Jundiaí/SP. Precisava de presença institucional imponente para transmitir autoridade corporativa e receber pedidos de cotação.',
    solution:
      'Site institucional com paleta executiva dark & gold, detalhamento de serviços e certificações, formulário direto de cotação empresarial e canal de recrutamento integrado ao WhatsApp.',
    tags: ['Segurança para Eventos', 'Portaria & Acesso', 'Rondas Preventivas', 'B2B & Condomínios'],
    urlLabel: 'toledoseguranca.netlify.app',
    href: 'https://toledoseguranca.netlify.app/',
    desktopImage: '/portifolio-toledoseguranca-desktop.webp',
    mobileImage: '/portifolio-toledoseguranca-mobile.webp',
    features: [
      'Apresentação corporativa de alta credibilidade',
      'Seções estruturadas para eventos e condomínios',
      'Canal duplo no WhatsApp (Orçamento + Vagas)',
    ],
    resultsNote: 'Autoridade imediata para propostas corporativas e eventos de médio a grande porte.',
  },
  {
    id: 'duelo-fim-de-ano',
    badge: 'Plataforma interativa & evento',
    status: 'Publicado & Ativo',
    title: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'landing',
    challenge:
      'Organização de clássico esportivo comunitário e beneficente de fim de ano que exigia engajamento interativo da torcida, votações dos melhores do jogo e mural de fotos dinâmico sem custo de servidores complexos.',
    solution:
      'Aplicação web com campo tático animado, votação interativa em tempo real ("Bola Cheia vs Bola Murcha"), cronologia de partidas anteriores e integração com comunidade esportiva.',
    tags: ['Interatividade', 'Engajamento Comunitário', 'Futebol Amador', 'UX Gamificada'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    desktopImage: '/portifolio-jogodefimdeano-desktop.webp',
    mobileImage: '/portifolio-jogodefimdeano-mobile.webp',
    features: [
      'Escalações em campo tático interativo',
      'Votação popular sem necessidade de login',
      'Galeria de fotos com carregamento otimizado',
    ],
    resultsNote: 'Mais de 1.000 acessos simultâneos na data do evento com nota máxima de performance.',
  },
];

type ViewMode = 'composite' | 'desktop' | 'mobile';

interface ProjectCardProps {
  project: PortfolioProjectData;
  onOpenZoom: (imgSrc: string, title: string) => void;
  onNavigateToServices?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenZoom, onNavigateToServices }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('composite');

  return (
    <article className="surface-card flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.08] hover:border-indigo-400/50 bg-[#0A0E17]/95 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group shadow-xl shadow-black/40">
      {/* Top Header / Informações */}
      <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-slate-950/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
            {project.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.status}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="text-indigo-400 font-bold">🌐</span>
            <span>{project.urlLabel}</span>
          </p>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white font-semibold">Desafio:</strong> {project.challenge}
          </p>
          <p>
            <strong className="text-indigo-300 font-semibold">Solução ēloSites:</strong> {project.solution}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/[0.06] text-[11px] font-medium text-slate-300"
            >
              <CheckCircle className="w-3 h-3 text-indigo-400" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Visual Mockup Area com Seletor */}
      <div className="p-4 sm:p-5 bg-[#060911] flex-1 flex flex-col justify-between space-y-4">
        {/* Controles de visualização: Composto, Desktop, Mobile */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/[0.06] text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('composite')}
              aria-label="Ver mockup composto sobreposto"
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'composite'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-center">Composto</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              aria-label="Ver imagem desktop"
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'desktop'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-center">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              aria-label="Ver imagem mobile"
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'mobile'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-center">Mobile</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenZoom(
                viewMode === 'mobile' ? project.mobileImage : project.desktopImage,
                `${project.title} (${viewMode.toUpperCase()})`
              )
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Ampliar captura em alta resolução"
            aria-label="Ampliar captura em tela cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Display do Mockup conforme Modo */}
        <div className="relative min-h-[300px] sm:min-h-[330px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/70 border border-white/[0.05] p-2 sm:p-3">
          {/* MODO 1: COMPOSTO (Desktop com largura total + Celular sobreposto à direita e abaixo) */}
          {viewMode === 'composite' && (
            <div className="relative w-full h-full flex items-center justify-center py-2">
              {/* Desktop Window Frame com largura total expandida */}
              <div className="w-full rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c101a] shadow-2xl shadow-black/80 transition-transform duration-300 group-hover:scale-[1.01]">
                {/* Browser topbar */}
                <div className="px-3 py-1.5 bg-slate-900 border-b border-white/[0.08] flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 bg-slate-950 rounded px-2 py-0.5 text-[10px] text-slate-400 font-mono truncate border border-white/[0.05]">
                    {project.urlLabel}
                  </div>
                </div>
                {/* Desktop Screenshot */}
                <div
                  className="aspect-[16/10] overflow-hidden bg-slate-900 cursor-zoom-in"
                  onClick={() => onOpenZoom(project.desktopImage, `${project.title} - Desktop`)}
                >
                  <img
                    src={project.desktopImage}
                    alt={`Versão Desktop do site ${project.title}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Mobile Phone Mockup Sobreposto (com largura ampliada para exibir a captura com clareza) */}
              <div
                className="absolute right-1 sm:right-2 -bottom-1 sm:bottom-0 w-[36%] sm:w-[33%] max-w-[155px] sm:max-w-[170px] rounded-[20px] p-1.5 sm:p-2 bg-[#090d16] border-2 border-indigo-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] shadow-indigo-950/60 transform translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-zoom-in z-10"
                onClick={() => onOpenZoom(project.mobileImage, `${project.title} - Mobile`)}
                title="Clique para ampliar versão mobile"
              >
                {/* Phone screen */}
                <div className="rounded-[14px] overflow-hidden aspect-[9/18] bg-black border border-white/[0.1] w-full">
                  <img
                    src={project.mobileImage}
                    alt={`Versão Mobile do site ${project.title}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                {/* Badge visual */}
                <div className="absolute -bottom-2 -left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-indigo-400/30">
                  📱 Mobile
                </div>
              </div>
            </div>
          )}

          {/* MODO 2: APENAS DESKTOP */}
          {viewMode === 'desktop' && (
            <div className="w-full rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c101a] shadow-xl">
              <div className="px-3 py-2 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono truncate">
                  {project.urlLabel}
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase">Desktop</span>
              </div>
              <div
                className="aspect-[16/10] overflow-hidden bg-slate-950 cursor-zoom-in"
                onClick={() => onOpenZoom(project.desktopImage, `${project.title} - Desktop`)}
              >
                <img
                  src={project.desktopImage}
                  alt={`Captura Desktop completa de ${project.title}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* MODO 3: APENAS MOBILE (Largura ampliada e centrada) */}
          {viewMode === 'mobile' && (
            <div className="flex items-center justify-center py-2 w-full">
              <div
                className="w-[210px] sm:w-[240px] max-w-full rounded-[26px] p-2 sm:p-2.5 bg-[#090d16] border-2 border-indigo-500/50 shadow-2xl shadow-black cursor-zoom-in"
                onClick={() => onOpenZoom(project.mobileImage, `${project.title} - Mobile`)}
              >
                {/* Speaker pill */}
                <div className="w-12 h-1.5 bg-slate-700 mx-auto rounded-full mb-1.5" />
                <div className="rounded-[20px] overflow-hidden aspect-[9/18] bg-black border border-white/[0.1] w-full">
                  <img
                    src={project.mobileImage}
                    alt={`Captura Mobile completa de ${project.title}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Card com Ações */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white transition-colors"
          >
            <span>Visitar site publicado</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <a
            href={whatsappUrl(`Olá! Vi o projeto ${project.title} da ēloSites e gostaria de solicitar um orçamento similar para meu negócio.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white border border-emerald-400/40 shadow-md shadow-emerald-950/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] active:shadow-[0_0_28px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-white drop-shadow-sm text-center">Quero igual</span>
          </a>
        </div>
      </div>
    </article>
  );
};

interface PortfolioSectionProps {
  onNavigateToServices?: () => void;
  onNavigateToOrcamento?: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onNavigateToServices,
  onNavigateToOrcamento,
}) => {
  const [filter, setFilter] = useState<'all' | 'landing' | 'institutional'>('all');
  const [zoomModal, setZoomModal] = useState<{ src: string; title: string } | null>(null);

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const whatsappInquiryUrl = whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage);

  return (
    <section
      id="portfolio"
      className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen flex flex-col justify-between"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/[0.08] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative w-full flex-1 flex flex-col justify-between">
        {/* Cabeçalho da Seção / Tela */}
        <div>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Portfólio de Projetos Reais</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight">
              Sites reais no ar, prontos para converter
            </h2>
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Explore nossos trabalhos recentes com alternador de tela Desktop e Mobile ou visualize o mockup composto sobreposto. Todos os projetos contam com código limpo, SEO técnico e carregamento instantâneo.
            </p>

            {/* Filtros de Categoria */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Todos ({PORTFOLIO_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('landing')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'landing'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Landing Pages
              </button>
              <button
                type="button"
                onClick={() => setFilter('institutional')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'institutional'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Sites Institucionais
              </button>
            </div>
          </div>

          {/* Grade de Projetos Reais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenZoom={(src, title) => setZoomModal({ src, title })}
                onNavigateToServices={onNavigateToServices}
              />
            ))}
          </div>
        </div>

        {/* Banner Inferior com Conversão Direta */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-400/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Gostou do nível dos projetos da ēloSites?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Cada projeto recebe um orçamento específico baseado no escopo. 50% de entrada no início + 50% na aprovação final (PIX), 20% de desconto à vista, até 5x sem juros ou de 6x a 12x no cartão.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            {onNavigateToServices && (
              <button
                type="button"
                onClick={onNavigateToServices}
                className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-all"
              >
                <span className="text-center">Ver Formatos & Condições</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <a
              id="portfolio-cta-whatsapp"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary w-full sm:w-auto inline-flex items-center justify-center text-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-center">Solicitar Orçamento</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Zoom em Alta Resolução */}
      {zoomModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoomModal.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomModal(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-950 rounded-2xl border border-white/[0.15] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{zoomModal.title}</span>
              <button
                type="button"
                onClick={() => setZoomModal(null)}
                aria-label="Fechar ampliação"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-5 overflow-auto flex items-center justify-center bg-slate-950/80">
              <img
                src={zoomModal.src}
                alt={zoomModal.title}
                className="max-h-[78vh] w-auto object-contain rounded-lg border border-white/[0.05]"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
