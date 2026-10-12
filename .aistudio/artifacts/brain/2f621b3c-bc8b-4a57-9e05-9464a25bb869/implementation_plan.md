# Plano de Implementação: Arquitetura Multitelas, Portfólio Real e Condições Comerciais ēloSites

## 1. Visão Geral e Objetivos
Transformar a experiência da ēloSites em uma **arquitetura de multitelas (SPA por telas dedicadas)**, atendendo integralmente às diretrizes do usuário:
- **Site Multitelas**: Cada seção estratégica passa a ser apresentada em sua própria tela/visão limpa, eliminando a rolagem contínua monótona e conferindo foco total ao conteúdo de cada etapa.
- **Navbar Simplificada com Botão Único**: O cabeçalho conterá apenas a logomarca ēloSites, o botão de destaque **"MENU DE NAVEGAÇÃO"** (com indicador de tela atual) e o botão direto do WhatsApp.
- **Menu de Navegação Estruturado**: Modal/gaveta completo e responsivo apresentando as 8 telas estratégicas do estúdio com ícones, descrições resumidas e navegação instantânea.
- **Portfólio com Imagens Reais & Mockup Composto**: Substituição definitiva de representações estruturais pelas imagens reais adicionadas na pasta `public`, oferecendo alternância interativa em cada card:
  - **Mockup Composto (Sobreposto)**: Tela Desktop de fundo com Tela Mobile em primeiro plano sobreposta e sombreada.
  - **Visão Desktop**: Monitor/navegador completo.
  - **Visão Mobile**: Smartphone com tela cheia.
  - Links diretos para os sites publicados e CTA contextual para WhatsApp.
- **Serviços & Regras de Pagamento Atualizadas**: Manter os 3 formatos de serviços e integrar com destaque todas as modalidades comerciais aprovadas:
  - Orçamento personalizado por escopo, seções, conteúdo e prazo.
  - 50% na contratação para início e 50% na entrega final (PIX).
  - 20% de desconto para pagamento à vista.
  - Cartão de crédito em até 5x sem juros (1 entrada + 4 parcelas).
  - Cartão de crédito de 6x a 12x com juros da operadora.

---

## 2. Telas da Arquitetura Multitelas

| ID da Tela | Nome da Tela | Descrição / Componente |
|---|---|---|
| `inicio` | Início / Apresentação | Hero com mensagem de entrega em até 7 dias, SEO técnico e terminal de stack |
| `portfolio` | Portfólio | Cards com alternador Composto, Desktop e Mobile com as imagens oficiais |
| `servicos` | Serviços & Pagamento | 3 formatos (Landing Page, Institucional, Personalizado) + Grade de Condições de Pagamento |
| `processo` | Como Funciona | Processo transparente em 4 etapas com curadoria humana |
| `diferenciais` | Diferenciais | Vantagens competitivas da ēloSites (velocidade, SEO, design limpo) |
| `orcamento` | Briefing & Agendamento | Formulário interativo de briefing e agendamento de conversa com Google Calendar |
| `faq` | Perguntas Frequentes | Dúvidas esclarecidas sobre prazos, domínios, pagamento e suporte |
| `contato` | Contato & Atendimento | CTA final com canais de atendimento direto via WhatsApp e e-mail |

---

## 3. Mapeamento dos Arquivos de Imagens no Portfólio (`public/`)

1. **JV Salvaia Personal Trainer**:
   - Desktop: `/portifolio-jvsalvaia-desktop.PNG`
   - Mobile: `/potifolio-jvsalvaia-mobile.jpg.jpeg`
   - Link: `https://jvsalvaiapersonal.netlify.app`
2. **Toledo Segurança**:
   - Desktop: `/portifolio-toledoseguranca-desktop.PNG`
   - Mobile: `/portifolio-toledoseguranca-mobile.jpg.jpeg`
   - Link: `https://toledoseguranca.netlify.app/`
3. **Duelo de Fim de Ano (Badem vs Becala)**:
   - Desktop: `/portifolio-jogodefimdeano-desktop.PNG`
   - Mobile: `/portifolio-jogodefimdeano-mobile.jpg.jpeg`
   - Link: `https://jogodefimdeano.netlify.app`

---

## 4. Plano de Alterações nos Arquivos

### A. `src/types.ts`
- Declarar o tipo `ScreenId` (`'inicio' | 'portfolio' | 'servicos' | 'processo' | 'diferenciais' | 'orcamento' | 'faq' | 'contato'`).
- Definir os itens de navegação com metadados: id, título, subtítulo, ícone e número de tela (1 a 8).
- Atualizar interface e dados de formas de pagamento para uso compartilhado.

### B. `src/components/Header.tsx`
- Reduzir o menu desktop para:
  - Logomarca oficial ēloSites à esquerda.
  - Botão central/destaque: **"MENU DE NAVEGAÇÃO"** com ícone interativo e badge da tela atual (ex.: `Tela 2 de 8: Portfólio`).
  - Botão WhatsApp à direita com chamada direta.
- Modal/Drawer de Navegação ao clicar em **"MENU DE NAVEGAÇÃO"**:
  - Grid elegante com as 8 telas, destacando a tela atualmente ativa.
  - Atalhos de teclado (Escape fecha, 1-8 troca de tela rapidamente).
  - Transição imediata para a tela selecionada ao clicar.

### C. `src/App.tsx`
- Implementar estado central de tela ativa: `currentScreen: ScreenId` (suportando sincronização com hash URL ex.: `#/portfolio`).
- Renderização condicional da tela ativa (substituindo a listagem contínua vertical).
- Barra de navegação inferior sutil com controles rápidos:
  - Botão "← Tela Anterior" e "Próxima Tela →".
  - Indicador numérico de progresso entre telas.
  - Acesso rápido para abrir o Menu de Navegação.
- Suporte a transições visuais suaves entre telas (AnimatePresence ou transições CSS de alta performance).
- Rolar automaticamente para o topo ao alternar de tela.

### D. `src/components/PortfolioSection.tsx`
- Remover o fallback de iframe ou placeholders estruturais.
- Implementar componente de exibição com 3 modos interativos por projeto:
  1. **Composto (Sobreposto)**: Mockup do Desktop em largura total com o smartphone Mobile sobreposto no canto inferior direito, exibindo a harmonia responsiva do projeto real.
  2. **Desktop**: Janela de navegador com a imagem real de desktop em alta resolução e barra de endereço com o domínio Netlify.
  3. **Mobile**: Moldura de smartphone com a imagem real do mobile.
- Botões seletores em cada card com feedback visual imediato.
- Efeito de ampliação/zoom ao passar o mouse ou clicar.

### E. `src/components/ServicesSection.tsx`
- Manter a apresentação detalhada dos 3 formatos de serviço.
- Adicionar a seção em destaque **"Condições de Pagamento e Orçamento"**:
  1. **Orçamento Personalizado**: Cálculo transparente com base no escopo, seções, conteúdo e prazo.
  2. **50% no Início + 50% na Entrega (PIX)**: Flexibilidade e segurança para ambas as partes.
  3. **20% de Desconto à Vista**: Vantagem imediata para pagamento integral no fechamento.
  4. **Cartão de Crédito em até 5x Sem Juros**: Entrada + 4 parcelas sem taxa adicional.
  5. **Cartão de Crédito de 6x até 12x**: Opção estendida com taxas padrão da operadora.
- Botões de CTA direcionando diretamente para conversa sobre o serviço escolhido no WhatsApp.

### F. `src/components/Footer.tsx`
- Adaptar links de navegação do rodapé para alternar para a tela correspondente através da função `onNavigate(screenId)` em vez de rolagem âncora simples.

---

## 5. Validação e Testes
1. Executar `lint_applet` e `compile_applet` para garantir compilação TypeScript 100% limpa sem erros.
2. Testar a alternância entre todas as 8 telas a partir do Menu de Navegação e da barra inferior.
3. Testar a renderização das 6 imagens do portfólio nos modos Composto, Desktop e Mobile.
4. Testar a responsividade e usabilidade em telas móveis e desktop.
