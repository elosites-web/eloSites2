import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  isInAppBrowser,
  getOptimalDpr,
  prefersReducedMotion,
  shouldReduceMedia,
  getMotionTier,
} from '../mediaPrefs';
import type { ScreenId } from '../types';

/**
 * Textura procedural do ponto de luz azul neon.
 * Orbe redondo no azul vibrante (#2F6BFF a #00D2FE) com núcleo branco brilhante e halo difuso.
 */
function createDotGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.18, '#93c5fd');
    gradient.addColorStop(0.38, '#3b82f6');
    gradient.addColorStop(0.65, 'rgba(47, 107, 255, 0.45)');
    gradient.addColorStop(0.85, 'rgba(0, 210, 254, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Textura do anel de onda de choque elétrica azul disparada no clique.
 */
function createShockwaveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    const grad = ctx.createRadialGradient(64, 64, 42, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 210, 254, 0)');
    grad.addColorStop(0.65, 'rgba(59, 130, 246, 0.7)');
    grad.addColorStop(0.82, 'rgba(147, 197, 253, 0.95)');
    grad.addColorStop(0.92, 'rgba(0, 210, 254, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(64, 64, 54, 0, Math.PI * 2);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Gera textura procedural do Blueprint Arquitetural Central (construção de sites).
 * Estilo futurista em violeta/púrpura com acentos em ciano/azul:
 * - Janela com wireframe de website (header, hero, grids, footer)
 * - Blocos de código limpos (HTML & CSS flexbox/grid)
 * - Árvore de componentes e nós de arquitetura
 * - 100% límpida sem blocos escuros/opacos
 */
function createArchitectBlueprintTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    // Fundo semitranslúcido violeta atmosférico sutil
    ctx.fillStyle = 'rgba(139, 92, 246, 0.035)';
    ctx.fillRect(0, 0, 512, 512);

    // Borda externa técnica
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, 496, 496);

    // Cantos em bracket neon violeta
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    const corner = 22;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(8, 8 + corner);
    ctx.lineTo(8, 8);
    ctx.lineTo(8 + corner, 8);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(504 - corner, 8);
    ctx.lineTo(504, 8);
    ctx.lineTo(504, 8 + corner);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(8, 504 - corner);
    ctx.lineTo(8, 504);
    ctx.lineTo(8 + corner, 504);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(504 - corner, 504);
    ctx.lineTo(504, 504);
    ctx.lineTo(504, 504 - corner);
    ctx.stroke();

    // Barra superior com título de arquitetura
    ctx.fillStyle = 'rgba(139, 92, 246, 0.18)';
    ctx.fillRect(10, 10, 492, 36);
    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('SITE ARCHITECTURE & DOM CORE', 24, 33);

    // Indicadores de nós de status no cabeçalho
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(456, 28, 3.5, 0, Math.PI * 2);
    ctx.arc(472, 28, 3.5, 0, Math.PI * 2);
    ctx.arc(488, 28, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 1. Wireframe Superior (Layout Web)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 60, 220, 114);
    ctx.strokeRect(266, 60, 220, 114);

    // Imagem wireframe com 'X' no box 1
    ctx.beginPath();
    ctx.moveTo(26, 60);
    ctx.lineTo(246, 174);
    ctx.moveTo(246, 60);
    ctx.lineTo(26, 174);
    ctx.stroke();

    // Mini navbar e estrutura no box 2
    ctx.strokeRect(276, 70, 200, 18);
    ctx.strokeRect(276, 98, 94, 64);
    ctx.strokeRect(382, 98, 94, 64);

    // 2. Bloco Central de Código HTML/CSS Estilizado
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.fillRect(26, 192, 460, 174);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.strokeRect(26, 192, 460, 174);

    ctx.fillStyle = '#a78bfa';
    ctx.font = '12px "JetBrains Mono", monospace';
    const lines = [
      '<div class="site-container">',
      '  <header class="hero-section">',
      '    display: flex; gap: 24px; align-items: center;',
      '  </header>',
      '  <main class="responsive-core">',
      '    seo_score: 100% /* technical */',
      '    conversion_rate: max /* whatsapp_flow */',
      '  </main>',
      '  <footer class="clean-code" />',
      '</div>',
    ];
    lines.forEach((line, i) => {
      // Destaca tags em ciano suave
      if (line.includes('<') || line.includes('>')) {
        ctx.fillStyle = '#67e8f9';
      } else if (line.includes('display:') || line.includes('gap:')) {
        ctx.fillStyle = '#c084fc';
      } else {
        ctx.fillStyle = '#93c5fd';
      }
      ctx.fillText(line, 42, 214 + i * 16.5);
    });

    // 3. Diagrama Inferior: Árvore de Componentes & Nós de Circuito
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Nó central inferior
    ctx.moveTo(256, 380);
    ctx.lineTo(256, 410);
    // Ramificação esquerda
    ctx.lineTo(120, 410);
    ctx.lineTo(120, 436);
    // Ramificação direita
    ctx.moveTo(256, 410);
    ctx.lineTo(392, 410);
    ctx.lineTo(392, 436);
    ctx.stroke();

    // Caixinhas de componentes na base
    const drawPillBox = (x: number, y: number, w: number, h: number, text: string) => {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(text, x + 10, y + 15);
    };

    drawPillBox(65, 436, 110, 22, 'UI Elements');
    drawPillBox(200, 436, 112, 22, 'Site Schema');
    drawPillBox(340, 436, 105, 22, 'Code Base');

    // Terminais e nós de circuito na base
    ctx.fillStyle = '#38bdf8';
    [120, 256, 392].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 480, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(x, 458);
      ctx.lineTo(x, 476);
      ctx.stroke();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Gera textura procedural do Painel Satélite Lateral:
 * Métricas de usuário, gráficos HUD, campos de busca e controles de layout.
 */
function createSubSchematicTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 256);

    ctx.fillStyle = 'rgba(139, 92, 246, 0.03)';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, 496, 240);

    // Título
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('ANALYTICS & CONVERSION ENGINE', 22, 28);

    // Gráfico de barras (User Metrics)
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
    ctx.strokeRect(22, 42, 220, 120);

    const barHeights = [28, 45, 65, 52, 78, 92, 85, 100];
    barHeights.forEach((h, i) => {
      const bx = 34 + i * 24;
      const by = 152 - h;
      ctx.fillStyle = i >= 5 ? '#38bdf8' : 'rgba(168, 85, 247, 0.7)';
      ctx.fillRect(bx, by, 16, h);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('Growth: +140%', 28, 180);

    // Gráfico de curva contínua à direita
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
    ctx.strokeRect(266, 42, 220, 120);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(276, 140);
    ctx.bezierCurveTo(320, 130, 360, 70, 410, 80);
    ctx.bezierCurveTo(430, 85, 450, 55, 476, 50);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SEO Technical: 100', 272, 180);

    // Controles de interface na parte inferior
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.strokeRect(22, 200, 150, 28);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText('🔍 Search Modules', 32, 218);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.strokeRect(190, 200, 140, 28);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText('⚡ Fast Deploy', 204, 218);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.strokeRect(348, 200, 138, 28);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText('⚙ System Active', 360, 218);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Representação de nós e segmentos de circuitos para o sistema de partículas
interface CircuitNode {
  x: number;
  y: number;
  z: number;
  neighbors: number[];
}

interface BlueDot {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  life: number;
  maxLife: number;
  pulseBoost: number;
  size: number;
}

interface Persistent3DSceneProps {
  onMounted?: () => void;
  isMenuOpen?: boolean;
  currentScreen?: ScreenId;
}

/**
 * Coordenadas de câmera dinâmicas por seção para navegação espacial suave
 */
const CAMERA_PRESETS: Record<ScreenId, { pos: [number, number, number]; target: [number, number, number] }> = {
  home: { pos: [0, 1.2, 11.2], target: [0, 0.3, 0] },
  inicio: { pos: [1.2, 0.7, 10.2], target: [-0.4, 0.2, 0] },
  portfolio: { pos: [-1.8, 1.5, 11.6], target: [0.5, 0.1, -1] },
  servicos: { pos: [1.5, -0.3, 9.8], target: [-0.5, 0.5, 0] },
  processo: { pos: [-1.1, 0.9, 10.5], target: [0.3, 0.3, -0.5] },
  orcamento: { pos: [0.9, 1.7, 10.9], target: [-0.2, 0.2, 0] },
  faq: { pos: [0, 0.6, 11.6], target: [0, 0.1, 0] },
};

/**
 * Componente Principal do Fundo 3D Persistente:
 * - Desenho de construção de sites (wireframes, blocos de código, esquemáticos e árvores)
 * - Circuitos em paleta futurista púrpura/violeta
 * - Pontos luminosos azuis correndo aleatoriamente pelas trilhas em movimento constante
 * - Balanço e resposta ao cursor do mouse e toques
 * - Pulso elétrico azul expansivo emitido a cada clique
 * - Câmera 3D viajando suavemente pelo espaço a cada seção
 */
export const Persistent3DScene: React.FC<Persistent3DSceneProps> = ({
  onMounted,
  isMenuOpen = false,
  currentScreen = 'home',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentScreenRef = useRef<ScreenId>(currentScreen);
  const isMenuOpenRef = useRef<boolean>(isMenuOpen);

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const inApp = isInAppBrowser();
    const isReduced = prefersReducedMotion() || shouldReduceMedia();
    const motionTier = getMotionTier();

    // 1. Criação de Cena e Névoa Atmosférica em tom obsidiana/violeta escuro
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050711, 0.024);

    // 2. Câmera Perspectiva
    const initialPreset = CAMERA_PRESETS[currentScreenRef.current] || CAMERA_PRESETS.home;
    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      90
    );
    camera.position.set(...initialPreset.pos);
    const cameraLookAt = new THREE.Vector3(...initialPreset.target);
    camera.lookAt(cameraLookAt);

    // 3. Renderer WebGL de Alta Performance
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile && !inApp,
        powerPreference: 'high-performance',
        precision: inApp || isMobile ? 'mediump' : 'highp',
      });
    } catch (err) {
      console.warn('WebGL indisponível, usando fallback CSS:', err);
      return;
    }

    const optimalDpr = getOptimalDpr(isMobile, inApp);
    renderer.setPixelRatio(optimalDpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Sistema de Iluminação Atmosférica (Violeta e Azul Neon)
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.4);
    scene.add(ambientLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 3.8, 36, 1.3);
    violetLight.position.set(3.5, 2.0, 3);
    scene.add(violetLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 3.2, 32, 1.3);
    blueLight.position.set(-3.5, 0.5, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.0, 24, 1.4);
    cyanLight.position.set(0, -2.5, 4);
    scene.add(cyanLight);

    // 5. Grupo Interativo Principal (segue o cursor do mouse e balança)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 6. Construção do Grafo de Circuitos (PCB Traces) e Grade do Piso
    const nodes: CircuitNode[] = [];
    const addNode = (x: number, y: number, z: number): number => {
      nodes.push({ x, y, z, neighbors: [] });
      return nodes.length - 1;
    };
    const connectNodes = (a: number, b: number) => {
      if (!nodes[a].neighbors.includes(b)) nodes[a].neighbors.push(b);
      if (!nodes[b].neighbors.includes(a)) nodes[b].neighbors.push(a);
    };

    // Linhas do Piso com perspectiva (Grid ortogonal com curvas de circuito)
    const floorY = -3.7;
    const gridCols = inApp ? 10 : isMobile ? 12 : 16;
    const gridRows = inApp ? 12 : isMobile ? 14 : 20;
    const spacingX = 1.6;
    const spacingZ = 1.6;
    const startX = -(gridCols * spacingX) / 2;
    const startZ = 4.0;

    const floorNodeIndices: number[][] = [];
    for (let r = 0; r <= gridRows; r++) {
      floorNodeIndices[r] = [];
      const z = startZ - r * spacingZ;
      for (let c = 0; c <= gridCols; c++) {
        const x = startX + c * spacingX;
        const idx = addNode(x, floorY, z);
        floorNodeIndices[r][c] = idx;
      }
    }

    // Conecta linhas do piso em Z (longitudinais)
    for (let c = 0; c <= gridCols; c++) {
      for (let r = 0; r < gridRows; r++) {
        connectNodes(floorNodeIndices[r][c], floorNodeIndices[r + 1][c]);
      }
    }

    // Conecta linhas do piso em X (transversais alternadas estilo circuito)
    for (let r = 0; r <= gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        // Padrão de circuito: quase todas as conexões horizontais mantidas para continuidade
        if ((r + c) % 3 !== 2) {
          connectNodes(floorNodeIndices[r][c], floorNodeIndices[r][c + 1]);
        }
      }
    }

    // Circuitos verticais e diagonais que sobem do piso em direção aos blueprints
    const conduitRisingIndices: number[] = [];
    const risingSpawns = [
      { c: Math.floor(gridCols * 0.25), r: 2, topX: -2.8, topY: 1.2, topZ: 0.5 },
      { c: Math.floor(gridCols * 0.4), r: 3, topX: -1.2, topY: -0.2, topZ: -0.4 },
      { c: Math.floor(gridCols * 0.5), r: 4, topX: 0.0, topY: 0.8, topZ: -0.8 },
      { c: Math.floor(gridCols * 0.6), r: 3, topX: 1.2, topY: -0.2, topZ: -0.4 },
      { c: Math.floor(gridCols * 0.75), r: 2, topX: 2.8, topY: 1.2, topZ: 0.5 },
      { c: Math.floor(gridCols * 0.3), r: 6, topX: -3.5, topY: 2.2, topZ: -1.5 },
      { c: Math.floor(gridCols * 0.7), r: 6, topX: 3.5, topY: 2.2, topZ: -1.5 },
    ];

    risingSpawns.forEach((spawn) => {
      const baseNode = floorNodeIndices[spawn.r]?.[spawn.c];
      if (baseNode !== undefined) {
        // Ponto intermediário a 45 graus (estilo placa de circuito integrado PCB)
        const midY = (floorY + spawn.topY) * 0.5;
        const midX = (nodes[baseNode].x + spawn.topX) * 0.5;
        const midZ = (nodes[baseNode].z + spawn.topZ) * 0.5;
        const midNode = addNode(midX, midY, midZ);
        const topNode = addNode(spawn.topX, spawn.topY, spawn.topZ);
        connectNodes(baseNode, midNode);
        connectNodes(midNode, topNode);
        conduitRisingIndices.push(topNode);
      }
    });

    // Conecta os nós superiores entre si formando a moldura cibernética
    for (let i = 0; i < conduitRisingIndices.length - 1; i++) {
      connectNodes(conduitRisingIndices[i], conduitRisingIndices[i + 1]);
    }

    // 7. Geometria de Linhas de Circuito (THREE.LineSegments com vertex colors)
    const linePoints: number[] = [];
    const lineColors: number[] = [];
    const colorViolet = new THREE.Color(0xa855f7);
    const colorIndigo = new THREE.Color(0x6366f1);
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorDeep = new THREE.Color(0x3b0764);

    const visitedPairs = new Set<string>();
    nodes.forEach((node, i) => {
      node.neighbors.forEach((nbr) => {
        const pairKey = i < nbr ? `${i}-${nbr}` : `${nbr}-${i}`;
        if (!visitedPairs.has(pairKey)) {
          visitedPairs.add(pairKey);
          const target = nodes[nbr];

          linePoints.push(node.x, node.y, node.z);
          linePoints.push(target.x, target.y, target.z);

          // Gradiente baseado na altura e profundidade
          const t = Math.max(0, Math.min(1, (node.y - floorY) / 6.0));
          const depthFade = Math.max(0.15, Math.min(1, (node.z + 18) / 22));

          const c1 = t > 0.4 ? colorViolet : colorIndigo;
          const c2 = t > 0.4 ? colorCyan : colorDeep;

          lineColors.push(c1.r * depthFade, c1.g * depthFade, c1.b * depthFade);
          lineColors.push(c2.r * depthFade, c2.g * depthFade, c2.b * depthFade);
        }
      });
    });

    const circuitGeo = new THREE.BufferGeometry();
    circuitGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    circuitGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const circuitMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: inApp ? 0.38 : 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const circuitLinesMesh = new THREE.LineSegments(circuitGeo, circuitMat);
    worldGroup.add(circuitLinesMesh);

    // 8. Painéis de Construção de Websites Flutuantes (Blueprints de wireframes e código)
    const blueprintTex = createArchitectBlueprintTexture();
    const subBlueprintTex = createSubSchematicTexture();

    // Painel Central (Layout e Código HTML/CSS)
    const centralCardGeo = new THREE.PlaneGeometry(isMobile ? 3.4 : 4.4, isMobile ? 3.4 : 4.4);
    const centralCardMat = new THREE.MeshBasicMaterial({
      map: blueprintTex,
      transparent: true,
      opacity: inApp ? 0.72 : 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const centralCard = new THREE.Mesh(centralCardGeo, centralCardMat);
    centralCard.position.set(0, 0.4, -0.6);
    worldGroup.add(centralCard);

    // Moldura de arame iluminada ao redor do card central
    const centralEdges = new THREE.EdgesGeometry(centralCardGeo);
    const centralEdgeMat = new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const centralEdgeMesh = new THREE.LineSegments(centralEdges, centralEdgeMat);
    centralCard.add(centralEdgeMesh);

    // Painel Satélite Esquerdo (Métricas e Analytics)
    const leftCardGeo = new THREE.PlaneGeometry(3.0, 1.5);
    const leftCardMat = new THREE.MeshBasicMaterial({
      map: subBlueprintTex,
      transparent: true,
      opacity: inApp ? 0.55 : 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const leftCard = new THREE.Mesh(leftCardGeo, leftCardMat);
    leftCard.position.set(-3.6, -0.8, 0.8);
    leftCard.rotation.y = 0.35;
    worldGroup.add(leftCard);

    // Painel Satélite Direito (Site Architecture & Rules)
    const rightCardGeo = new THREE.PlaneGeometry(3.0, 1.5);
    const rightCardMat = new THREE.MeshBasicMaterial({
      map: subBlueprintTex,
      transparent: true,
      opacity: inApp ? 0.55 : 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const rightCard = new THREE.Mesh(rightCardGeo, rightCardMat);
    rightCard.position.set(3.6, -0.8, 0.8);
    rightCard.rotation.y = -0.35;
    worldGroup.add(rightCard);

    // 9. Sistema de Pontos de Luz Azuis (Elétrons cibernéticos que viajam pelas trilhas)
    const dotTex = createDotGlowTexture();
    const dotCount = isReduced
      ? 0
      : motionTier === 'lite' || inApp
      ? 12
      : isMobile
      ? 18
      : 32;

    const blueDots: BlueDot[] = [];
    const dotPositions = new Float32Array(Math.max(1, dotCount) * 3);
    const dotColors = new Float32Array(Math.max(1, dotCount) * 3);
    const dotSizes = new Float32Array(Math.max(1, dotCount));

    for (let i = 0; i < dotCount; i++) {
      const from = Math.floor(Math.random() * nodes.length);
      const neighbors = nodes[from].neighbors;
      const to = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : from;

      blueDots.push({
        fromNode: from,
        toNode: to,
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.55,
        life: 0,
        maxLife: 3.5 + Math.random() * 4.0,
        pulseBoost: 0,
        size: isMobile ? 18.0 : 26.0,
      });

      // Inicializa posições na array
      const nFrom = nodes[from];
      dotPositions[i * 3 + 0] = nFrom.x;
      dotPositions[i * 3 + 1] = nFrom.y;
      dotPositions[i * 3 + 2] = nFrom.z;

      // Cor azul neon vibrante (#38BDF8 a #3B82F6)
      dotColors[i * 3 + 0] = 0.4;
      dotColors[i * 3 + 1] = 0.75;
      dotColors[i * 3 + 2] = 1.0;

      dotSizes[i] = isMobile ? 18.0 : 26.0;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    dotGeo.setAttribute('size', new THREE.BufferAttribute(dotSizes, 1));

    const dotMat = new THREE.PointsMaterial({
      size: isMobile ? 22 : 30,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dotPointsMesh = new THREE.Points(dotGeo, dotMat);
    worldGroup.add(dotPointsMesh);

    // 10. Onda de Choque Elétrica Disparada no Clique (Shockwave Mesh)
    const shockTex = createShockwaveTexture();
    const shockGeo = new THREE.PlaneGeometry(1, 1);
    const shockMat = new THREE.MeshBasicMaterial({
      map: shockTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(shockGeo, shockMat);
    shockwaveMesh.rotation.x = -Math.PI / 2;
    shockwaveMesh.position.set(0, floorY + 0.05, 0);
    worldGroup.add(shockwaveMesh);

    let shockwaveActive = false;
    let shockwaveScale = 0.1;
    let shockwaveOpacity = 0;
    let shockwaveOriginX = 0;
    let shockwaveOriginZ = 0;

    const triggerClickPulse = (clientX: number, clientY: number) => {
      // Converte coordenadas do clique para normalized device coordinates
      const ndcX = (clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(clientY / window.innerHeight) * 2 + 1;

      // Projeta aproximadamente no plano do mundo
      shockwaveOriginX = ndcX * 6.5;
      shockwaveOriginZ = -ndcY * 3.5;
      shockwaveMesh.position.x = shockwaveOriginX;
      shockwaveMesh.position.z = shockwaveOriginZ;

      shockwaveActive = true;
      shockwaveScale = 0.2;
      shockwaveOpacity = 1.0;

      // Impulso de aceleração elétrica instantânea nas partículas azuis
      blueDots.forEach((dot) => {
        dot.pulseBoost = 1.8;
      });
    };

    // 11. Controle de Ponteiro do Mouse e Toque (Balanço com amortecimento / Spring physics)
    let pointerX = 0;
    let pointerY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetTiltY = pointerX * 0.14;
      targetTiltX = -pointerY * 0.1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      triggerClickPulse(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // 12. Redimensionamento e Pausa na Ocultação
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let isTabHidden = false;
    const handleVisibility = () => {
      isTabHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 13. Loop de Animação Contínua (Perpetual Movement com Zero GC)
    let animationFrameId: number;
    let lastTime = performance.now();
    let clockTime = 0;

    const currentCamPos = camera.position.clone();
    const currentCamTarget = cameraLookAt.clone();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isTabHidden) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      clockTime += delta;

      // Interpolação suave da câmera de acordo com a seção ativa
      const activePreset = CAMERA_PRESETS[currentScreenRef.current] || CAMERA_PRESETS.home;
      const menuTargetY = isMenuOpenRef.current ? activePreset.pos[1] + 0.8 : activePreset.pos[1];

      currentCamPos.x += (activePreset.pos[0] - currentCamPos.x) * 0.04;
      currentCamPos.y += (menuTargetY - currentCamPos.y) * 0.04;
      currentCamPos.z += (activePreset.pos[2] - currentCamPos.z) * 0.04;
      camera.position.copy(currentCamPos);

      currentCamTarget.x += (activePreset.target[0] - currentCamTarget.x) * 0.04;
      currentCamTarget.y += (activePreset.target[1] - currentCamTarget.y) * 0.04;
      currentCamTarget.z += (activePreset.target[2] - currentCamTarget.z) * 0.04;
      camera.lookAt(currentCamTarget);

      // Balanço elástico suave da cena seguindo o cursor do mouse
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      worldGroup.rotation.y = currentTiltY + Math.sin(clockTime * 0.35) * 0.025;
      worldGroup.rotation.x = currentTiltX + Math.cos(clockTime * 0.4) * 0.015;
      worldGroup.position.x = currentTiltY * 0.8;
      worldGroup.position.y = -currentTiltX * 0.5;

      // Flutuação suave dos painéis de blueprint de website
      centralCard.position.y = 0.4 + Math.sin(clockTime * 0.8) * 0.06;
      leftCard.position.y = -0.8 + Math.cos(clockTime * 0.9 + 1.2) * 0.05;
      rightCard.position.y = -0.8 + Math.sin(clockTime * 0.9 + 2.0) * 0.05;

      // Respiração pulsante sutil na iluminação violeta
      violetLight.intensity = 3.4 + Math.sin(clockTime * 1.6) * 0.6;
      blueLight.intensity = 3.0 + Math.cos(clockTime * 1.8) * 0.5;

      // Atualização dos pontos de luz azuis ao longo dos circuitos
      if (dotCount > 0) {
        const posAttr = dotGeo.attributes.position as THREE.BufferAttribute;
        const colAttr = dotGeo.attributes.color as THREE.BufferAttribute;
        const sizeAttr = dotGeo.attributes.size as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const colArray = colAttr.array as Float32Array;
        const sizeArray = sizeAttr.array as Float32Array;

        for (let i = 0; i < dotCount; i++) {
          const dot = blueDots[i];
          const nodeFrom = nodes[dot.fromNode];
          const nodeTo = nodes[dot.toNode];

          // Amortecimento do pulso acelerador de clique
          if (dot.pulseBoost > 0) {
            dot.pulseBoost = Math.max(0, dot.pulseBoost - delta * 2.2);
          }

          const currentSpeed = dot.speed + dot.pulseBoost;
          dot.progress += delta * currentSpeed;
          dot.life += delta;

          if (dot.progress >= 1.0 || dot.life >= dot.maxLife) {
            // Chegou ao fim do segmento: escolhe próximo vizinho aleatório
            dot.fromNode = dot.toNode;
            const nextNeighbors = nodes[dot.fromNode]?.neighbors || [];
            if (nextNeighbors.length > 0) {
              dot.toNode = nextNeighbors[Math.floor(Math.random() * nextNeighbors.length)];
            } else {
              dot.fromNode = Math.floor(Math.random() * nodes.length);
              const reNeighbors = nodes[dot.fromNode]?.neighbors || [];
              dot.toNode = reNeighbors.length > 0 ? reNeighbors[0] : dot.fromNode;
            }
            dot.progress = 0;
            if (dot.life >= dot.maxLife) {
              dot.life = 0;
              dot.maxLife = 3.5 + Math.random() * 4.0;
            }
          }

          // Interpolação linear da posição na trilha
          const p = Math.min(1, Math.max(0, dot.progress));
          const nx = nodeFrom.x + (nodeTo.x - nodeFrom.x) * p;
          const ny = nodeFrom.y + (nodeTo.y - nodeFrom.y) * p;
          const nz = nodeFrom.z + (nodeTo.z - nodeFrom.z) * p;

          posArray[i * 3 + 0] = nx;
          posArray[i * 3 + 1] = ny;
          posArray[i * 3 + 2] = nz;

          // Efeito de brilho estroboscópico azul neon suave
          const pulseBright = 1.0 + dot.pulseBoost * 0.8;
          colArray[i * 3 + 0] = 0.35 * pulseBright;
          colArray[i * 3 + 1] = 0.75 * pulseBright;
          colArray[i * 3 + 2] = 1.0 * pulseBright;

          sizeArray[i] = dot.size * (1.0 + dot.pulseBoost * 0.45);
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
      }

      // Expansão da onda de choque azul ao clicar
      if (shockwaveActive) {
        shockwaveScale += delta * 14.0;
        shockwaveOpacity -= delta * 1.6;

        shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, 1);
        shockMat.opacity = Math.max(0, shockwaveOpacity);

        if (shockwaveOpacity <= 0) {
          shockwaveActive = false;
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    if (onMounted) onMounted();

    // 14. Limpeza e Descarte Total ao Desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      circuitGeo.dispose();
      circuitMat.dispose();
      centralCardGeo.dispose();
      centralCardMat.dispose();
      centralEdges.dispose();
      centralEdgeMat.dispose();
      leftCardGeo.dispose();
      leftCardMat.dispose();
      rightCardGeo.dispose();
      rightCardMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      shockGeo.dispose();
      shockMat.dispose();

      blueprintTex.dispose();
      subBlueprintTex.dispose();
      dotTex.dispose();
      shockTex.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    />
  );
};
