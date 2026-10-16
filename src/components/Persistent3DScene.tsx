import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isInAppBrowser, getOptimalDpr, shouldReduceMedia } from '../mediaPrefs';

/**
 * Gera textura procedural 2D de alta definição contendo o blueprint cibernético
 * com código HTML/CSS, wireframe e árvore de arquitetura (idêntico às referências)
 */
function createCyberBlueprintTexture(type: 'architecture' | 'components'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Fundo translúcido com brilho ciano suave
    ctx.fillStyle = 'rgba(6, 12, 24, 0.72)';
    ctx.fillRect(0, 0, 512, 512);

    // Borda técnica externa
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, 496, 496);

    // Cantos destacados (bracket corners)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    const corner = 24;
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

    // Barra superior com título e nós de circuito
    ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.fillRect(10, 10, 492, 38);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(type === 'architecture' ? '// SITE ARCHITECTURE & DOM' : '// CORE ENGINE METRICS', 24, 34);

    // 3 pontos de interface
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.beginPath();
    ctx.arc(460, 29, 3.5, 0, Math.PI * 2);
    ctx.arc(474, 29, 3.5, 0, Math.PI * 2);
    ctx.arc(488, 29, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (type === 'architecture') {
      // Wireframe superior estilo blueprint (como na referência)
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 64, 210, 110);
      ctx.strokeRect(270, 64, 210, 110);

      // Linhas diagonais de wireframe no box 1
      ctx.beginPath();
      ctx.moveTo(30, 64);
      ctx.lineTo(240, 174);
      ctx.moveTo(240, 64);
      ctx.lineTo(30, 174);
      ctx.stroke();

      // Linhas de layout no box 2
      ctx.strokeRect(280, 74, 190, 20);
      ctx.strokeRect(280, 104, 90, 60);
      ctx.strokeRect(380, 104, 90, 60);

      // Bloco de código central estilizado
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(30, 190, 450, 180);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.strokeRect(30, 190, 450, 180);

      ctx.fillStyle = '#67e8f9';
      ctx.font = '13px "JetBrains Mono", monospace';
      const lines = [
        '<div class="site-container">',
        '  <header class="hero-section">',
        '    display: flex; gap: 24px;',
        '    align-items: center;',
        '  </header>',
        '  <main class="responsive-core">',
        '    seo_score: 100% // technical',
        '    performance: 99+ // clean_code',
        '  </main>',
        '</div>',
      ];
      lines.forEach((line, i) => {
        ctx.fillText(line, 45, 216 + i * 16.5);
      });

      // Trilhas e nós na base (estilo árvore de arquitetura)
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(100, 390);
      ctx.lineTo(100, 430);
      ctx.lineTo(256, 430);
      ctx.lineTo(256, 470);
      ctx.moveTo(412, 390);
      ctx.lineTo(412, 430);
      ctx.lineTo(256, 430);
      ctx.stroke();

      // Caixinhas de nós na árvore
      ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.fillRect(60, 390, 80, 24);
      ctx.strokeRect(60, 390, 80, 24);
      ctx.fillRect(372, 390, 80, 24);
      ctx.strokeRect(372, 390, 80, 24);
      ctx.fillRect(206, 470, 100, 24);
      ctx.strokeRect(206, 470, 100, 24);

      ctx.fillStyle = '#a5b4fc';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('<Layout />', 68, 406);
      ctx.fillText('<Header />', 380, 406);
      ctx.fillText('<AppRoot />', 216, 486);
    } else {
      // Painel de métricas e gráficos holográficos
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;

      // Gráfico de barras digital
      ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.fillRect(30, 64, 450, 140);
      ctx.strokeRect(30, 64, 450, 140);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('SPEED & CONVERSION METRICS', 45, 88);

      const bars = [40, 65, 85, 95, 75, 100, 92, 98];
      bars.forEach((val, idx) => {
        const barHeight = (val / 100) * 80;
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.65)' : 'rgba(129, 140, 248, 0.65)';
        ctx.fillRect(50 + idx * 50, 184 - barHeight, 32, barHeight);
      });

      // Bloco de circuito e microprocessador
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.fillRect(30, 224, 450, 250);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.strokeRect(30, 224, 450, 250);

      // Chip central
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(186, 280, 140, 110);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('ēloSites', 222, 332);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#a5b4fc';
      ctx.fillText('ENGINE v2', 226, 350);

      // Pinos saindo do chip em 90 graus
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      for (let p = 0; p < 4; p++) {
        // Esquerda
        ctx.beginPath();
        ctx.moveTo(186, 296 + p * 24);
        ctx.lineTo(80, 296 + p * 24);
        ctx.stroke();
        // Direita
        ctx.beginPath();
        ctx.moveTo(326, 296 + p * 24);
        ctx.lineTo(430, 296 + p * 24);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Textura procedural de pulso luminoso para partículas de circuito
 */
function createPulseGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 10);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
    gradient.addColorStop(0.8, 'rgba(6, 9, 18, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Textura procedural de halo emissivo para realce holográfico ciano/violeta
 */
function createEmissiveHaloTexture(colorType: 'cyan' | 'violet'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 14, 64, 64, 64);
    if (colorType === 'cyan') {
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
      gradient.addColorStop(0.35, 'rgba(6, 182, 212, 0.24)');
      gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.08)');
      gradient.addColorStop(1, 'rgba(6, 9, 18, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(165, 180, 252, 0.42)');
      gradient.addColorStop(0.35, 'rgba(129, 140, 248, 0.24)');
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.08)');
      gradient.addColorStop(1, 'rgba(6, 9, 18, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface Persistent3DSceneProps {
  onMounted?: () => void;
  isMenuOpen?: boolean;
}

export const Persistent3DScene: React.FC<Persistent3DSceneProps> = ({ onMounted, isMenuOpen = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMenuOpenRef = useRef(isMenuOpen);

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = shouldReduceMedia();
    const isMobile = window.innerWidth < 768;
    const inApp = isInAppBrowser();

    // Cena e Névoa Atmosférica em tom obsidiana escuro
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060912, 0.022);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    camera.position.set(0, 1.2, 10.5);

    // Renderer WebGL altamente otimizado
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile && !inApp,
        powerPreference: 'high-performance',
        precision: inApp || isMobile ? 'mediump' : 'highp',
      });
    } catch (err) {
      console.warn('WebGL indisponível; utilizando fundo CSS.', err);
      return;
    }

    const optimalDpr = getOptimalDpr(isMobile, inApp);
    renderer.setPixelRatio(optimalDpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // SISTEMA DE ILUMINAÇÃO GLOBAL CIANO-VIOLETA
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    scene.add(ambientLight);

    const globalCyanLight = new THREE.PointLight(0x06b6d4, 3.2, 32, 1.4);
    globalCyanLight.position.set(-3.5, 2.5, 3);
    scene.add(globalCyanLight);

    const globalVioletLight = new THREE.PointLight(0x818cf8, 2.8, 32, 1.4);
    globalVioletLight.position.set(3.5, 0.5, 1);
    scene.add(globalVioletLight);

    // =========================================================================
    // 1. GRADE DE PERSPECTIVA INFINITA NO SOLO (GROUND GRID EM CIANO/VIOLETA)
    // =========================================================================
    const gridCols = inApp ? 12 : isMobile ? 14 : 20;
    const gridRows = inApp ? 14 : isMobile ? 18 : 26;
    const gridSpacing = 1.8;
    const totalW = gridCols * gridSpacing;
    const totalL = gridRows * gridSpacing;

    const gridPoints: number[] = [];
    const gridColors: number[] = [];

    const cyanCol = new THREE.Color(0x06b6d4);
    const indigoCol = new THREE.Color(0x6366f1);
    const dimCyan = new THREE.Color(0x0284c7);

    // Linhas paralelas em Z (profundidade)
    for (let c = 0; c <= gridCols; c++) {
      const x = -totalW / 2 + c * gridSpacing;
      // Vértice perto
      gridPoints.push(x, -3.8, 4);
      // Vértice longe no horizonte
      gridPoints.push(x, -3.8, -totalL + 4);

      const t = Math.abs(x) / (totalW / 2);
      const col = t > 0.6 ? indigoCol : cyanCol;
      gridColors.push(col.r * 0.7, col.g * 0.7, col.b * 0.7);
      gridColors.push(dimCyan.r * 0.15, dimCyan.g * 0.15, dimCyan.b * 0.25);
    }

    // Linhas perpendiculares em X (largura)
    for (let r = 0; r <= gridRows; r++) {
      const z = 4 - r * gridSpacing;
      gridPoints.push(-totalW / 2, -3.8, z);
      gridPoints.push(totalW / 2, -3.8, z);

      const fade = Math.max(0, 1 - r / gridRows);
      gridColors.push(cyanCol.r * 0.5 * fade, cyanCol.g * 0.5 * fade, cyanCol.b * 0.6 * fade);
      gridColors.push(cyanCol.r * 0.5 * fade, cyanCol.g * 0.5 * fade, cyanCol.b * 0.6 * fade);
    }

    const groundGridGeo = new THREE.BufferGeometry();
    groundGridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
    groundGridGeo.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));

    const groundGridMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: inApp ? 0.35 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const groundGridMesh = new THREE.LineSegments(groundGridGeo, groundGridMat);

    // Grupo interativo para inclinação conjunta da grade de perspectiva e circuitos
    const gridInteractiveGroup = new THREE.Group();
    scene.add(gridInteractiveGroup);
    gridInteractiveGroup.add(groundGridMesh);

    // =========================================================================
    // 2. PAINÉIS HOLOGRÁFICOS DE CÓDIGO E BLUEPRINT COM BRILHO EMISSIVO REATIVO
    // =========================================================================
    const codePanelsGroup = new THREE.Group();
    scene.add(codePanelsGroup);

    const textureArch = createCyberBlueprintTexture('architecture');
    const textureMetrics = createCyberBlueprintTexture('components');
    const haloCyanTex = createEmissiveHaloTexture('cyan');
    let haloVioletTex: THREE.CanvasTexture | null = null;

    const cardPlaneGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const haloGeo = new THREE.PlaneGeometry(6.4, 6.4);

    const cardMat1 = new THREE.MeshStandardMaterial({
      map: textureArch,
      emissiveMap: textureArch,
      emissive: new THREE.Color(0x06b6d4),
      emissiveIntensity: 0.36,
      roughness: 0.22,
      metalness: 0.1,
      transparent: true,
      opacity: inApp ? 0.44 : 0.56,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const card1 = new THREE.Mesh(cardPlaneGeo, cardMat1);
    card1.position.set(isMobile ? -0.2 : -3.6, 0.4, -4.5);
    card1.rotation.y = 0.22;
    card1.rotation.x = -0.05;
    codePanelsGroup.add(card1);

    // Halo emissivo traseiro com brilho difuso ciano
    const card1HaloMat = new THREE.MeshBasicMaterial({
      map: haloCyanTex,
      transparent: true,
      opacity: inApp ? 0.12 : 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const card1Halo = new THREE.Mesh(haloGeo, card1HaloMat);
    card1Halo.position.set(0, 0, -0.04);
    card1.add(card1Halo);

    let card2: THREE.Mesh | null = null;
    let cardMat2: THREE.MeshStandardMaterial | null = null;
    let card2HaloMat: THREE.MeshBasicMaterial | null = null;

    if (!isMobile && !inApp) {
      cardMat2 = new THREE.MeshStandardMaterial({
        map: textureMetrics,
        emissiveMap: textureMetrics,
        emissive: new THREE.Color(0x818cf8),
        emissiveIntensity: 0.38,
        roughness: 0.22,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      card2 = new THREE.Mesh(cardPlaneGeo, cardMat2);
      card2.position.set(3.8, -0.2, -6.0);
      card2.rotation.y = -0.26;
      card2.rotation.x = -0.04;
      codePanelsGroup.add(card2);

      // Halo emissivo traseiro com brilho difuso violeta
      haloVioletTex = createEmissiveHaloTexture('violet');
      card2HaloMat = new THREE.MeshBasicMaterial({
        map: haloVioletTex,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const card2Halo = new THREE.Mesh(haloGeo, card2HaloMat);
      card2Halo.position.set(0, 0, -0.04);
      card2.add(card2Halo);
    }

    // =========================================================================
    // 3. TRILHAS DE CIRCUITO EM 90 GRAUS E PULSOS DE ENERGIA LUMINOSA
    // =========================================================================
    const circuitsGroup = new THREE.Group();
    gridInteractiveGroup.add(circuitsGroup);

    interface CircuitTrace {
      points: THREE.Vector3[];
      totalLen: number;
      progress: number;
      speed: number;
    }

    const traces: CircuitTrace[] = [];
    const TRACE_COUNT = inApp ? 3 : isMobile ? 4 : 5;
    const circuitPoints: number[] = [];
    const circuitColors: number[] = [];

    const spanX = 14;
    for (let t = 0; t < TRACE_COUNT; t++) {
      const tracePoints: THREE.Vector3[] = [];
      // Distribuição uniforme por faixas laterais distintas para impedir sobreposição e aglomeração
      const corridorOffset = ((t / (TRACE_COUNT - 1 || 1)) - 0.5) * spanX;
      let x = corridorOffset + (Math.random() - 0.5) * 0.8;
      let y = -3.76; // Ligeiramente acima da grade do solo
      let z = -22 + (t * 2.5);

      tracePoints.push(new THREE.Vector3(x, y, z));

      const steps = 3;
      for (let s = 0; s < steps; s++) {
        // Passo em Z
        z += 3.5 + Math.random() * 2.5;
        tracePoints.push(new THREE.Vector3(x, y, z));

        // Curva ortogonal em 90 graus em X mantendo o corredor lateral
        const xOffset = (t % 2 === 0 ? 1 : -1) * (1.6 + Math.random() * 1.4);
        x += xOffset;
        tracePoints.push(new THREE.Vector3(x, y, z));
      }

      // Converte pontos em pares de linha para LineSegments
      for (let p = 0; p < tracePoints.length - 1; p++) {
        const p1 = tracePoints[p];
        const p2 = tracePoints[p + 1];
        circuitPoints.push(p1.x, p1.y, p1.z);
        circuitPoints.push(p2.x, p2.y, p2.z);

        const isCyan = t % 2 === 0;
        const color = isCyan ? cyanCol : indigoCol;
        circuitColors.push(color.r * 0.55, color.g * 0.55, color.b * 0.65);
        circuitColors.push(color.r * 0.35, color.g * 0.35, color.b * 0.45);
      }

      // Calcula comprimento total do caminho
      let totalLen = 0;
      for (let p = 0; p < tracePoints.length - 1; p++) {
        totalLen += tracePoints[p].distanceTo(tracePoints[p + 1]);
      }

      // Fases uniformemente espaçadas e velocidades cadenciadas para animação natural sem aglomeração
      traces.push({
        points: tracePoints,
        totalLen,
        progress: t / TRACE_COUNT,
        speed: (0.09 + (t % 3) * 0.015) * (prefersReduced ? 0.3 : 1.0),
      });
    }

    const circuitGeo = new THREE.BufferGeometry();
    circuitGeo.setAttribute('position', new THREE.Float32BufferAttribute(circuitPoints, 3));
    circuitGeo.setAttribute('color', new THREE.Float32BufferAttribute(circuitColors, 3));

    const circuitMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: inApp ? 0.4 : 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const circuitLinesMesh = new THREE.LineSegments(circuitGeo, circuitMat);
    circuitsGroup.add(circuitLinesMesh);

    // Partículas de pulso que viajam sobre as trilhas ortogonais (já distribuídas desde o frame 0)
    const pulseTexture = createPulseGlowTexture();
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(TRACE_COUNT * 3);
    for (let t = 0; t < TRACE_COUNT; t++) {
      const trace = traces[t];
      const targetDist = (trace.progress % 1) * trace.totalLen;
      let accum = 0;
      let pX = trace.points[0].x;
      let pY = trace.points[0].y;
      let pZ = trace.points[0].z;

      for (let p = 0; p < trace.points.length - 1; p++) {
        const segLen = trace.points[p].distanceTo(trace.points[p + 1]);
        if (accum + segLen >= targetDist) {
          const segRatio = segLen > 0 ? (targetDist - accum) / segLen : 0;
          pX = trace.points[p].x + (trace.points[p + 1].x - trace.points[p].x) * segRatio;
          pY = trace.points[p].y + (trace.points[p + 1].y - trace.points[p].y) * segRatio;
          pZ = trace.points[p].z + (trace.points[p + 1].z - trace.points[p].z) * segRatio;
          break;
        }
        accum += segLen;
      }

      pulsePositions[t * 3] = pX;
      pulsePositions[t * 3 + 1] = pY;
      pulsePositions[t * 3 + 2] = pZ;
    }
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: inApp ? 0.12 : isMobile ? 0.14 : 0.18,
      map: pulseTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x38bdf8,
      opacity: inApp ? 0.32 : 0.42,
    });

    const pulseMesh = new THREE.Points(pulseGeo, pulseMat);
    circuitsGroup.add(pulseMesh);

    // =========================================================================
    // 4. CHUVA DIGITAL LEVE NO HORIZONTE (MATRIX/CYBER STREAM EM BAIXA DENSIDADE)
    // =========================================================================
    const STREAM_COUNT = inApp ? 8 : isMobile ? 12 : 18;
    const streamGeo = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(STREAM_COUNT * 3);
    const streamVelocities: number[] = [];

    for (let i = 0; i < STREAM_COUNT; i++) {
      streamPositions[i * 3] = (Math.random() - 0.5) * 22;
      streamPositions[i * 3 + 1] = -4 + Math.random() * 12;
      streamPositions[i * 3 + 2] = -12 - Math.random() * 14;
      streamVelocities.push(0.016 + Math.random() * 0.028);
    }

    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));

    const streamMat = new THREE.PointsMaterial({
      size: 0.14,
      map: pulseTexture,
      transparent: true,
      opacity: inApp ? 0.1 : 0.16,
      blending: THREE.AdditiveBlending,
      color: 0x06b6d4,
      depthWrite: false,
    });

    const streamMesh = new THREE.Points(streamGeo, streamMat);
    scene.add(streamMesh);

    let targetScroll = 0;
    let currentScroll = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let returnToCenterTimeout: number | undefined;

    let scrollTicking = false;
    let animationFrameId = 0;
    let running = false;
    let onScreen = true;
    let lastFrameTime = 0;

    // Monitor de Performance (FPS dinâmico) e taxa de quadros adaptativa
    let isLowPerf = false;
    let targetInterval = isMobile || inApp ? 1000 / 40 : 0; // ~40 FPS padrão em mobile; desktop inicia a 60 FPS
    const FPS_SAMPLE_WINDOW = 60;
    const frameDeltas: number[] = [];
    let fpsWarmupFrames = 90; // Ignora os primeiros 90 quadros (~1.5s) de carga inicial
    let lowFpsConsecutiveCount = 0;
    const LOW_FPS_THRESHOLD = 45;
    const LOW_FPS_CONSECUTIVE_LIMIT = 45; // ~1s sustentado abaixo de 45 FPS
    let frameCounter = 0;

    const clock = new THREE.Clock();

    const handleScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          targetScroll = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
          if (prefersReduced) {
            currentScroll = targetScroll;
            camera.position.y = 1.2 - currentScroll * 1.5;
            camera.lookAt(0, -0.4 - currentScroll * 0.8, -8);
            renderer.render(scene, camera);
          }
          scrollTicking = false;
        });
      }
    };

    // Retorno automático e suave ao centro neutro quando o usuário para a interação
    const resetPointerTarget = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const scheduleReturnToCenter = () => {
      if (returnToCenterTimeout) clearTimeout(returnToCenterTimeout);
      returnToCenterTimeout = window.setTimeout(resetPointerTarget, 2200);
    };

    // Evento de hover de mouse / cursor
    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReduced) return;
      targetPointerX = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPointerX = Math.max(-1, Math.min(1, targetPointerX));
      targetPointerY = Math.max(-1, Math.min(1, targetPointerY));
      scheduleReturnToCenter();
    };

    // Evento de toque (touch) em telas móveis e tablets
    const handleTouchMove = (e: TouchEvent) => {
      if (prefersReduced || !e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      targetPointerX = (touch.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = -(touch.clientY / window.innerHeight) * 2 + 1;
      targetPointerX = Math.max(-1, Math.min(1, targetPointerX));
      targetPointerY = Math.max(-1, Math.min(1, targetPointerY));
      scheduleReturnToCenter();
    };

    const handlePointerLeave = () => {
      resetPointerTarget();
    };

    const handleTouchEnd = () => {
      resetPointerTarget();
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(getOptimalDpr(window.innerWidth < 768, inApp));
      if (prefersReduced) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // Loop de renderização com Zero GC (reaproveita arrays pré-alocados)
    const animate = (timestamp = 0) => {
      if (!running) return;
      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(animate);
      }

      // Limita taxa de quadros (mobile ou fixada em 30 FPS no modo de economia)
      if (targetInterval > 0 && timestamp - lastFrameTime < targetInterval) {
        return;
      }
      lastFrameTime = timestamp;
      frameCounter++;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // =======================================================================
      // MONITOR DE PERFORMANCE EM TEMPO REAL (FPS MONITOR)
      // =======================================================================
      if (!prefersReduced && !isLowPerf) {
        if (fpsWarmupFrames > 0) {
          fpsWarmupFrames--;
        } else {
          frameDeltas.push(delta);
          if (frameDeltas.length > FPS_SAMPLE_WINDOW) {
            frameDeltas.shift();
          }

          if (frameDeltas.length >= FPS_SAMPLE_WINDOW) {
            let totalDelta = 0;
            for (let i = 0; i < frameDeltas.length; i++) {
              totalDelta += frameDeltas[i];
            }
            const measuredFps = totalDelta > 0 ? frameDeltas.length / totalDelta : 60;

            // Se o FPS cair abaixo de 45 de forma mantida, ativa alívio de performance
            if (measuredFps < LOW_FPS_THRESHOLD) {
              lowFpsConsecutiveCount++;
              if (lowFpsConsecutiveCount >= LOW_FPS_CONSECUTIVE_LIMIT) {
                isLowPerf = true;
                // 1. Fixa a taxa de renderização a 30 FPS estáveis
                targetInterval = 1000 / 30;

                // 2. Oculta painel holográfico secundário
                if (card2) {
                  card2.visible = false;
                }
                card1HaloMat.opacity = 0.15;

                // 3. Reduz diâmetro de partículas para menor fill-rate da GPU
                pulseMat.size = 0.14;
                pulseMat.needsUpdate = true;
              }
            } else {
              lowFpsConsecutiveCount = Math.max(0, lowFpsConsecutiveCount - 1);
            }
          }
        }
      }

      // Amortecimento suave de scroll e inclinação holográfica (lerp)
      // Se o menu de navegação estiver aberto, o background 3D alinha-se suavemente à visão centralizada da Home (targetScroll = 0)
      const effectiveTargetScroll = isMenuOpenRef.current ? 0 : targetScroll;
      currentScroll += (effectiveTargetScroll - currentScroll) * 0.08;
      currentPointerX += (targetPointerX - currentPointerX) * 0.05;
      currentPointerY += (targetPointerY - currentPointerY) * 0.05;

      // Movimentação elegante e sutil da câmera com paralaxe e movimento autônomo contínuo
      const autoCamX = Math.sin(elapsedTime * 0.22) * 0.16;
      const autoCamY = Math.cos(elapsedTime * 0.18) * 0.1;
      camera.position.x = currentPointerX * 0.45 + autoCamX;
      camera.position.y = 1.2 + currentPointerY * 0.35 - currentScroll * 1.5 + autoCamY;
      camera.lookAt(0, -0.4 - currentScroll * 0.8, -8);

      // Deslocamento contínuo da grade de perspectiva infinita no solo (gliding perspective)
      groundGridMesh.position.z = (elapsedTime * 0.8) % gridSpacing;

      // Inclinação holográfica 3D interativa da grade e circuitos na direção do cursor/toque
      gridInteractiveGroup.rotation.z = -currentPointerX * 0.045;
      gridInteractiveGroup.rotation.x = currentPointerY * 0.04;
      gridInteractiveGroup.position.x = currentPointerX * 0.25;

      // =======================================================================
      // ILUMINAÇÃO GLOBAL E RESPOSTA EMISSIVA HOLOGRÁFICA CIANO-VIOLETA
      // =======================================================================
      const breathCyan = 0.35 + Math.sin(elapsedTime * 1.5) * 0.08;
      const breathViolet = 0.38 + Math.cos(elapsedTime * 1.3) * 0.08;

      // Fontes de luz globais reagem dinamicamente à posição do cursor/toque e scroll
      globalCyanLight.position.x = -3.2 + currentPointerX * 3.8;
      globalCyanLight.position.y = 2.0 + currentPointerY * 2.2 - currentScroll * 2.0;
      globalCyanLight.intensity = 3.2 + Math.abs(currentPointerX) * 0.8;

      globalVioletLight.position.x = 3.2 - currentPointerX * 3.8;
      globalVioletLight.position.y = 0.5 - currentPointerY * 1.8 - currentScroll * 2.5;
      globalVioletLight.intensity = 2.8 + Math.abs(currentPointerY) * 0.8;

      // Brilho emissivo nos painéis holográficos reagindo à proximidade e energia global
      const pointerEnergy = (Math.abs(currentPointerX) + Math.abs(currentPointerY)) * 0.12;
      cardMat1.emissiveIntensity = isLowPerf ? 0.32 : breathCyan + pointerEnergy;
      card1HaloMat.opacity = isLowPerf ? 0.1 : 0.14 + breathCyan * 0.12 + pointerEnergy * 0.1;

      if (cardMat2 && card2HaloMat) {
        cardMat2.emissiveIntensity = isLowPerf ? 0.32 : breathViolet + pointerEnergy;
        card2HaloMat.opacity = isLowPerf ? 0.1 : 0.12 + breathViolet * 0.12 + pointerEnergy * 0.1;
      }

      if (!prefersReduced) {
        // Flutuação holográfica suave dos painéis de código com rotação reactiva
        card1.position.y = 0.4 + Math.sin(elapsedTime * 0.9) * 0.12;
        card1.rotation.z = Math.sin(elapsedTime * 0.6) * 0.015;
        card1.rotation.y = 0.22 + currentPointerX * 0.08;
        card1.rotation.x = -0.05 - currentPointerY * 0.06;

        if (card2 && card2.visible) {
          card2.position.y = -0.2 + Math.cos(elapsedTime * 0.8) * 0.14;
          card2.rotation.z = Math.cos(elapsedTime * 0.5) * 0.015;
          card2.rotation.y = -0.26 + currentPointerX * 0.08;
          card2.rotation.x = -0.04 - currentPointerY * 0.06;
        }
      }

      // Movimentos procedurais de luzes andando no circuito 3D imersivo (contínuos e suaves)
      const pulseArr = pulseGeo.attributes.position.array as Float32Array;
      for (let t = 0; t < TRACE_COUNT; t++) {
        const trace = traces[t];
        trace.progress = (trace.progress + delta * trace.speed) % 1;

        // Interpola a posição do pulso ao longo dos pontos ortogonais do caminho
        const targetDist = trace.progress * trace.totalLen;
        let accum = 0;
        let pX = trace.points[0].x;
        let pY = trace.points[0].y;
        let pZ = trace.points[0].z;

        for (let p = 0; p < trace.points.length - 1; p++) {
          const segLen = trace.points[p].distanceTo(trace.points[p + 1]);
          if (accum + segLen >= targetDist) {
            const segRatio = segLen > 0 ? (targetDist - accum) / segLen : 0;
            pX = trace.points[p].x + (trace.points[p + 1].x - trace.points[p].x) * segRatio;
            pY = trace.points[p].y + (trace.points[p + 1].y - trace.points[p].y) * segRatio;
            pZ = trace.points[p].z + (trace.points[p + 1].z - trace.points[p].z) * segRatio;
            break;
          }
          accum += segLen;
        }

        pulseArr[t * 3] = pX;
        pulseArr[t * 3 + 1] = pY;
        pulseArr[t * 3 + 2] = pZ;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      // Atualização contínua e suave da chuva digital no horizonte
      const streamArr = streamGeo.attributes.position.array as Float32Array;
      const rainDelta = delta > 0 ? delta / 0.016 : 1;
      for (let s = 0; s < STREAM_COUNT; s++) {
        streamArr[s * 3 + 1] -= streamVelocities[s] * rainDelta;
        if (streamArr[s * 3 + 1] < -4) {
          streamArr[s * 3 + 1] = 8;
          streamArr[s * 3] = (Math.random() - 0.5) * 24;
        }
      }
      streamGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const start = () => {
      if (!running) {
        running = true;
        clock.start();
        animate(performance.now());
      }
    };

    const stop = () => {
      running = false;
      clock.stop();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    // Pausa inteligente apenas se a aba estiver oculta
    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    start();

    // Notifica que o 3D foi montado com sucesso para transição suave do skeleton
    requestAnimationFrame(() => {
      onMounted?.();
    });

    // Desalocação completa de recursos ao desmontar (Zero Memory Leak)
    return () => {
      stop();
      if (returnToCenterTimeout) clearTimeout(returnToCenterTimeout);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      groundGridGeo.dispose();
      groundGridMat.dispose();

      cardPlaneGeo.dispose();
      haloGeo.dispose();
      cardMat1.dispose();
      cardMat2?.dispose();
      card1HaloMat.dispose();
      card2HaloMat?.dispose();
      textureArch.dispose();
      textureMetrics.dispose();
      haloCyanTex.dispose();
      haloVioletTex?.dispose();

      scene.remove(ambientLight);
      scene.remove(globalCyanLight);
      scene.remove(globalVioletLight);

      circuitGeo.dispose();
      circuitMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      pulseTexture.dispose();

      streamGeo.dispose();
      streamMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-85"
      style={{ willChange: 'transform' }}
    />
  );
};
