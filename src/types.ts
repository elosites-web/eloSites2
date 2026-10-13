/**
 * ēloSites — Configurações, tipos e dados globais do site
 */

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export type ScreenId =
  | 'inicio'
  | 'portfolio'
  | 'servicos'
  | 'processo'
  | 'diferenciais'
  | 'orcamento'
  | 'faq'
  | 'contato';

export interface ScreenMeta {
  id: ScreenId;
  number: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  iconName: string;
}

export const SCREENS: ScreenMeta[] = [
  {
    id: 'inicio',
    number: '01',
    title: 'Início & Apresentação',
    shortTitle: 'Início',
    badge: 'Visão Geral',
    description: 'Proposta de valor, demonstração interativa e o padrão de engenharia da ēloSites.',
    iconName: 'Sparkles',
  },
  {
    id: 'portfolio',
    number: '02',
    title: 'Portfólio de Projetos Reais',
    shortTitle: 'Portfólio',
    badge: 'Projetos no Ar',
    description: 'Cases publicados com mockups compostos e alternador interativo Desktop e Mobile.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'servicos',
    number: '03',
    title: 'Serviços & Condições Comerciais',
    shortTitle: 'Serviços',
    badge: 'Formatos & Pagamento',
    description: '3 formatos de sites, orçamento sob medida, 20% à vista e parcelamento em até 12x.',
    iconName: 'Briefcase',
  },
  {
    id: 'processo',
    number: '04',
    title: 'Como Funciona o Processo',
    shortTitle: 'Processo',
    badge: '4 Etapas Ágeis',
    description: 'Da ideia ao site no ar em dias, com comunicação direta e curadoria humana.',
    iconName: 'Workflow',
  },
  {
    id: 'diferenciais',
    number: '05',
    title: 'Diferenciais ēloSites',
    shortTitle: 'Diferenciais',
    badge: 'Vantagens Reais',
    description: 'Foco total em conversão no WhatsApp, sem intermediários e com velocidade máxima.',
    iconName: 'Zap',
  },
  {
    id: 'orcamento',
    number: '06',
    title: 'Briefing & Agendamento',
    shortTitle: 'Orçamento',
    badge: 'Simulação Rápida',
    description: 'Monte o briefing do seu projeto ou agende uma reunião executiva no Google Meet.',
    iconName: 'CalendarCheck',
  },
  {
    id: 'faq',
    number: '07',
    title: 'Perguntas Frequentes (FAQ)',
    shortTitle: 'FAQ',
    badge: 'Dúvidas Claras',
    description: 'Respostas diretas sobre prazos, domínio, hospedagem, pagamentos e suporte.',
    iconName: 'HelpCircle',
  },
  {
    id: 'contato',
    number: '08',
    title: 'Canais de Contato & Atendimento',
    shortTitle: 'Contato',
    badge: 'Fale Conosco',
    description: 'Converse diretamente com o desenvolvedor responsável pelo seu projeto.',
    iconName: 'PhoneCall',
  },
];

export const PAYMENT_CONDITIONS = {
  customBudgetNotice:
    'Cada serviço obtém orçamento personalizado, considerando escopo, seções, conteúdo e prazo acordado.',
  pixSplitRule:
    '50% no momento da contratação para início do projeto e 50% na entrega final (via PIX).',
  cashDiscountPercent: 20,
  cashDiscountText:
    '20% de desconto sobre o valor do projeto orçado para pagamento à vista.',
  creditCardNoInterestMax: 5,
  creditCardNoInterestText:
    'Cartão de crédito em até 5x sem juros (1 entrada + 4 parcelas).',
  creditCardInterestRangeText:
    'De 6x até 12x no cartão de crédito com os juros/taxas da operadora para o cliente.',
};

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  role: string;
  description: string;
  objectives: string[];
  servicesHighlighted: string[];
  versions: {
    id: string;
    name: string;
    badge: string;
    url: string;
    tagline: string;
    accentColor: string;
    features: string[];
    bgImage: string;
    logoImage?: string;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  idealFor: string[];
  deliverables: string[];
  priceNote: string;
  badge?: string;
}

export interface DifferentialItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProjectBriefData {
  contactName: string;
  businessName: string;
  segment: string;
  projectType: string;
  timeline: string;
  description: string;
  whatsappContact: string;
  agreedToLgpd: boolean;
}

export interface MeetingBookingData {
  name: string;
  businessName: string;
  whatsappOrEmail: string;
  preferredDate: string;
  preferredTimeSlot: string;
  platform: string;
  meetingTopic: string;
  agreedToLgpd: boolean;
  notes?: string;
}

export const SITE_CONFIG = {
  name: 'ēloSites',
  domain: 'www.elosites.ia.br',
  canonicalUrl: 'https://www.elosites.ia.br',
  tagline: 'Criação de sites profissionais com SEO técnico, foco em conversão e entrega ágil, sem prometer prazo absoluto.',
  subtagline: 'Desenvolvemos a presença digital completa e estratégica para pequenos negócios e profissionais liberais.',
  email: 'contato@elosites.ia.br',
  // Número oficial da ēloSites
  whatsappNumber: '5511995722584',
  whatsappDisplay: '+55 (11) 99572-2584',
  // Mensagens contextuais para cada CTA
  heroWhatsappMessage:
    'Olá! Conheci a ēloSites e gostaria de solicitar um orçamento para criar o site profissional do meu negócio.',
  headerWhatsappMessage:
    'Olá! Gostaria de falar sobre a criação de um site profissional para o meu negócio.',
  portfolioWhatsappMessage:
    'Olá! Vi os projetos da ēloSites e quero um site com esse padrão e SEO técnico para o meu negócio.',
  landingPageWhatsappMessage:
    'Olá! Tenho interesse em uma Landing Page de alta conversão para o meu negócio com entrega rápida.',
  siteInstitucionalWhatsappMessage:
    'Olá! Tenho interesse em um site institucional completo com SEO técnico para a minha empresa.',
  personalizadoWhatsappMessage:
    'Olá! Gostaria de conversar sobre um projeto personalizado sob medida para o meu negócio com a ēloSites.',
  finalCtaWhatsappMessage:
    'Olá! Gostaria de iniciar o projeto do meu site profissional com a ēloSites.',
  floatingWhatsappMessage:
    'Olá! Gostaria de tirar dúvidas sobre a criação do meu site com a equipe da ēloSites.',
  mobileMenuWhatsappMessage:
    'Olá! Gostaria de conversar sobre a criação de um site para o meu negócio.',
  defaultWhatsappMessage:
    'Olá! Gostaria de saber mais sobre a criação de sites da ēloSites.',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Início', href: '#inicio', id: 'nav-inicio' },
  { label: 'Portfólio', href: '#portfolio', id: 'nav-portfolio' },
  { label: 'Serviços & Condições', href: '#servicos', id: 'nav-servicos' },
  { label: 'Como Funciona', href: '#como-funciona', id: 'nav-processo' },
  { label: 'Diferenciais', href: '#diferenciais', id: 'nav-diferenciais' },
  { label: 'Briefing & Agendamento', href: '#briefing-agendamento', id: 'nav-orcamento' },
  { label: 'FAQ', href: '#faq', id: 'nav-faq' },
  { label: 'Contato', href: '#contato', id: 'nav-contato' },
];

/**
 * Constrói URL direta do WhatsApp com o número oficial e texto codificado
 */
export function whatsappUrl(message?: string): string {
  const text = message || SITE_CONFIG.defaultWhatsappMessage;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Formata os dados de Briefing em mensagem estruturada para o WhatsApp
 */
export function formatBriefingWhatsappMessage(data: ProjectBriefData): string {
  return [
    `*📋 NOVO BRIEFING — ēloSites*`,
    ``,
    `*👤 Nome:* ${data.contactName.trim()}`,
    `*🏢 Negócio:* ${data.businessName.trim()}`,
    `*🏷️ Segmento:* ${data.segment}`,
    `*💻 Tipo de Projeto:* ${data.projectType}`,
    `*⏱️ Prazo Desejado:* ${data.timeline}`,
    `*📱 WhatsApp do Cliente:* ${data.whatsappContact.trim()}`,
    data.description.trim() ? `*📝 Detalhes e Objetivos:*\n${data.description.trim()}` : '',
    ``,
    `Gostaria de receber uma proposta comercial personalizada considerando as opções de pagamento (PIX 50/50, 20% à vista ou cartão em até 5x sem juros).`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Formata os dados de Agendamento em mensagem estruturada para o WhatsApp
 */
export function formatBookingWhatsappMessage(data: MeetingBookingData): string {
  return [
    `*📅 SOLICITAÇÃO DE REUNIÃO — ēloSites*`,
    ``,
    `*👤 Nome:* ${data.name.trim()}`,
    `*🏢 Empresa:* ${data.businessName.trim()}`,
    `*📞 Contato:* ${data.whatsappOrEmail.trim()}`,
    `*🗓️ Data Sugerida:* ${data.preferredDate}`,
    `*⏰ Horário:* ${data.preferredTimeSlot}`,
    `*💻 Plataforma:* ${data.platform}`,
    `*🎯 Pauta:* ${data.meetingTopic}`,
    data.notes?.trim() ? `*📌 Observações:* ${data.notes.trim()}` : '',
    ``,
    `Gostaria de confirmar a disponibilidade para esta reunião e alinharmos o projeto!`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Gera link para adição do evento no Google Calendar
 */
export function createGoogleCalendarUrl(data: MeetingBookingData): string {
  const title = encodeURIComponent(`Reunião ēloSites — Alinhamento de Projeto (${data.name})`);
  const details = encodeURIComponent(
    `Reunião via ${data.platform} para alinhamento estratégico do site da ${data.businessName}.\nPauta: ${data.meetingTopic}\nContato: ${data.whatsappOrEmail}`
  );
  const location = encodeURIComponent(data.platform === 'Google Meet' ? 'Google Meet (link a ser enviado)' : 'WhatsApp Chamada');

  // Ajusta data base
  const dateParts = data.preferredDate.split('-');
  const yyyy = dateParts[0] || '2026';
  const mm = dateParts[1] || '10';
  const dd = dateParts[2] || '15';

  let startHour = '140000';
  let endHour = '144500';

  if (data.preferredTimeSlot.includes('Manhã')) {
    startHour = '100000';
    endHour = '104500';
  } else if (data.preferredTimeSlot.includes('Noite')) {
    startHour = '190000';
    endHour = '194500';
  }

  const dates = `${yyyy}${mm}${dd}T${startHour}Z/${yyyy}${mm}${dd}T${endHour}Z`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

/**
 * Gera arquivo padrão .ics para importação em qualquer aplicativo de calendário
 */
export function generateIcsContent(data: MeetingBookingData): string {
  const dateFormatted = data.preferredDate.replace(/-/g, '');
  let timeStr = '140000';
  let endTimeStr = '144500';

  if (data.preferredTimeSlot.includes('Manhã')) {
    timeStr = '100000';
    endTimeStr = '104500';
  } else if (data.preferredTimeSlot.includes('Noite')) {
    timeStr = '190000';
    endTimeStr = '194500';
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//eloSites//Agendamento Estrategico//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `SUMMARY:Reunião ēloSites — Alinhamento de Projeto (${data.name})`,
    `DESCRIPTION:Pauta: ${data.meetingTopic}\\nEmpresa: ${data.businessName}\\nContato: ${data.whatsappOrEmail}`,
    `DTSTART:${dateFormatted}T${timeStr}Z`,
    `DTEND:${dateFormatted}T${endTimeStr}Z`,
    `LOCATION:${data.platform}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
