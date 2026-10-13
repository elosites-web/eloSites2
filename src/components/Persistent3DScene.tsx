import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Textura procedural de nó luminoso (sem dependência externa)
 */
function createNodeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(129, 140, 248, 0.95)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.6)');
    gradient.addColorStop(0.85, 'rgba(148, 163, 184, 0.2)');
    gradient.addColorStop(1, 'rgba(11, 15, 26, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export const Persistent3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configuração de Cena, Névoa Atmosférica e Câmera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f1a, 0.022);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      140
    );
    camera.position.set(0, 0, 12);

    // Renderer WebGL autônomo com buffer alpha e ACESFilmicToneMapping
    const isMobile = window.innerWidth < 768;
    const DPR_CAP = 1.5;

    // Se o WebGL falhar, não renderiza nada (o fundo CSS da página continua).
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL indisponível; mantendo apenas o fundo CSS.', err);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0x0b0f1a, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.5);
    dirLight1.position.set(10, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 2.0);
    dirLight2.position.set(-10, -8, 6);
    scene.add(dirLight2);

    // =========================================================================
    // 1. MALHA DE NÓS E PARTÍCULAS 3D COM CONEXÕES DINÂMICAS (CONSTELAÇÃO DATA)
    // =========================================================================
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const NODE_COUNT = isMobile ? 45 : 90;
    const nodeTexture = createNodeGlowTexture();
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];
    const nodeBasePositions: THREE.Vector3[] = [];

    const nodesGeo = new THREE.BufferGeometry();
    const nodePosArray = new Float32Array(NODE_COUNT * 3);
    const nodeColorArray = new Float32Array(NODE_COUNT * 3);

    const indigoCol = new THREE.Color(0x6366f1);
    const lilacCol = new THREE.Color(0x818cf8);
    const slateCol = new THREE.Color(0x94a3b8);

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 20;
      const z = -14 + Math.random() * 22;

      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeBasePositions.push(new THREE.Vector3(x, y, z));
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.025
        )
      );

      nodePosArray[i * 3] = x;
      nodePosArray[i * 3 + 1] = y;
      nodePosArray[i * 3 + 2] = z;

      const rnd = Math.random();
      const col = rnd < 0.5 ? indigoCol : rnd < 0.82 ? lilacCol : slateCol;
      nodeColorArray[i * 3] = col.r;
      nodeColorArray[i * 3 + 1] = col.g;
      nodeColorArray[i * 3 + 2] = col.b;
    }

    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArray, 3));
    nodesGeo.setAttribute('color', new THREE.BufferAttribute(nodeColorArray, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: 0.65,
      map: nodeTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    nodesGroup.add(nodesMesh);

    // Conexões dinâmicas entre nós próximos (Linhas de dados)
    const MAX_CONNECTIONS = isMobile ? 130 : 280;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
    const lineColors = new Float32Array(MAX_CONNECTIONS * 2 * 3);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(linesMesh);

    // =========================================================================
    // 2. GRID CIBERNÉTICO EM PERSPECTIVA 3D COM PULSOS DE LUZ (CHÃO & TETO)
    // =========================================================================
    const gridStep = 1.8;
    const gridRows = isMobile ? 20 : 32;
    const gridCols = isMobile ? 18 : 28;
    const gridWidth = gridCols * gridStep;
    const gridLength = gridRows * gridStep;

    const groundGridGroup = new THREE.Group();
    scene.add(groundGridGroup);
    groundGridGroup.position.set(0, -5.2, -18);
    groundGridGroup.rotation.x = -Math.PI / 2 + 0.14;

    const groundGridGeo = new THREE.PlaneGeometry(gridWidth, gridLength, gridCols, gridRows);
    const groundGridMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const groundGridMesh = new THREE.Mesh(groundGridGeo, groundGridMat);
    groundGridGroup.add(groundGridMesh);

    // Grid do teto em lilás
    const ceilingGridGroup = new THREE.Group();
    scene.add(ceilingGridGroup);
    ceilingGridGroup.position.set(0, 6.8, -18);
    ceilingGridGroup.rotation.x = Math.PI / 2 - 0.14;

    const ceilingGridGeo = new THREE.PlaneGeometry(gridWidth, gridLength, gridCols, gridRows);
    const ceilingGridMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ceilingGridMesh = new THREE.Mesh(ceilingGridGeo, ceilingGridMat);
    ceilingGridGroup.add(ceilingGridMesh);

    // =========================================================================
    // 3. CIRCUITOS DIGITAIS E FLUXO DE DADOS NEON (PULSOS E TRILHAS ELETRÔNICAS)
    // =========================================================================
    const circuitsGroup = new THREE.Group();
    scene.add(circuitsGroup);

    interface CircuitTrack {
      line: THREE.Line;
      geo: THREE.BufferGeometry;
      mat: THREE.LineBasicMaterial;
      pulseSphere: THREE.Mesh;
      pathPoints: THREE.Vector3[];
      progress: number;
      speed: number;
    }

    const circuitTracks: CircuitTrack[] = [];
    const TRACK_COUNT = isMobile ? 8 : 16;
    const sphereSharedGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const sphereMats: THREE.MeshBasicMaterial[] = [];

    for (let t = 0; t < TRACK_COUNT; t++) {
      const waypoints: THREE.Vector3[] = [];
      let curX = (Math.random() - 0.5) * 28;
      let curY = (Math.random() - 0.5) * 16;
      let curZ = -22 + Math.random() * 12;
      waypoints.push(new THREE.Vector3(curX, curY, curZ));

      // Caminho ortogonal em ângulo reto (estilo PCB / circuitos digitais)
      const segments = 4 + Math.floor(Math.random() * 4);
      for (let s = 0; s < segments; s++) {
        const axis = Math.floor(Math.random() * 3);
        const dist = 3 + Math.random() * 6;
        if (axis === 0) curX += (Math.random() > 0.5 ? 1 : -1) * dist;
        else if (axis === 1) curY += (Math.random() > 0.5 ? 1 : -1) * dist;
        else curZ += Math.random() * dist; // avança em direção à câmera
        waypoints.push(new THREE.Vector3(curX, curY, curZ));
      }

      // Amostragem suave da curva para a linha
      const curve = new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.2);
      const points = curve.getPoints(50);
      const trackGeo = new THREE.BufferGeometry().setFromPoints(points);

      const isIndigo = t % 2 === 0;
      const trackCol = isIndigo ? 0x6366f1 : 0x818cf8;
      const trackMat = new THREE.LineBasicMaterial({
        color: trackCol,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });

      const trackLine = new THREE.Line(trackGeo, trackMat);
      circuitsGroup.add(trackLine);

      // Pulso luminoso correndo pelo circuito
      const sMat = new THREE.MeshBasicMaterial({
        color: isIndigo ? 0x6366f1 : 0x818cf8,
      });
      sphereMats.push(sMat);
      const pulseSphere = new THREE.Mesh(sphereSharedGeo, sMat);
      circuitsGroup.add(pulseSphere);

      circuitTracks.push({
        line: trackLine,
        geo: trackGeo,
        mat: trackMat,
        pulseSphere,
        pathPoints: points,
        progress: Math.random(),
        speed: 0.08 + Math.random() * 0.12,
      });
    }

    // =========================================================================
    // 4. INTERAÇÃO E SCROLL DINÂMICO BIDIRECIONAL COM INÉRCIA E VELOCIDADE
    // =========================================================================
    let targetScroll = 0;
    let currentScroll = 0;
    let lastScroll = 0;
    let scrollVelocity = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let time = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // =========================================================================
    // 5. LOOP DE ANIMAÇÃO 60FPS
    // =========================================================================
    let animationFrameId = 0;
    let running = false;
    let onScreen = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const motionFactor = prefersReducedMotion ? 0.2 : 1.0;
      time += delta * motionFactor;

      // Cálculo de velocidade e direção do scroll (ida e volta)
      scrollVelocity = (targetScroll - currentScroll) * 8.0;
      currentScroll += (targetScroll - currentScroll) * 0.08;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const scrollDelta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      // A. ATUALIZAÇÃO DOS NÓS E LINHAS DINÂMICAS COM INFLUXO DO SCROLL
      const positions = nodesGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < NODE_COUNT; i++) {
        const v = nodeVelocities[i];
        const base = nodeBasePositions[i];

        // Movimento randômico suave + reação direta à velocidade de ida e volta do scroll
        const scrollKick = scrollDelta * 25.0 * motionFactor;
        const driftX = Math.sin(time * 0.7 + i * 0.3) * 0.012 * motionFactor;
        const driftY = Math.cos(time * 0.6 + i * 0.4) * 0.012 * motionFactor;

        nodePositions[i].x += v.x * motionFactor + driftX;
        nodePositions[i].y += v.y * motionFactor + driftY;
        // Scroll para baixo puxa em uma direção, scroll para cima inverte o fluxo (ida e volta)
        nodePositions[i].z += v.z * motionFactor + scrollKick;

        // Mantém dentro dos limites espaciais com recuo elástico
        if (nodePositions[i].x < -18 || nodePositions[i].x > 18) v.x *= -1;
        if (nodePositions[i].y < -12 || nodePositions[i].y > 12) v.y *= -1;
        if (nodePositions[i].z < -24) nodePositions[i].z = 6;
        if (nodePositions[i].z > 8) nodePositions[i].z = -22;

        positions[i * 3] = nodePositions[i].x;
        positions[i * 3 + 1] = nodePositions[i].y;
        positions[i * 3 + 2] = nodePositions[i].z;
      }
      nodesGeo.attributes.position.needsUpdate = true;

      // Atualiza conexões dinâmicas (linhas de proximidade entre nós)
      let lineIndex = 0;
      const posArr = lineGeo.attributes.position.array as Float32Array;
      const colArr = lineGeo.attributes.color.array as Float32Array;
      const CONNECT_DIST_SQ = 5.2 * 5.2;

      for (let i = 0; i < NODE_COUNT && lineIndex < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < NODE_COUNT && lineIndex < MAX_CONNECTIONS; j++) {
          const dx = nodePositions[i].x - nodePositions[j].x;
          const dy = nodePositions[i].y - nodePositions[j].y;
          const dz = nodePositions[i].z - nodePositions[j].z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < CONNECT_DIST_SQ) {
            const alpha = 1.0 - Math.sqrt(distSq) / 5.2;

            posArr[lineIndex * 6] = nodePositions[i].x;
            posArr[lineIndex * 6 + 1] = nodePositions[i].y;
            posArr[lineIndex * 6 + 2] = nodePositions[i].z;

            posArr[lineIndex * 6 + 3] = nodePositions[j].x;
            posArr[lineIndex * 6 + 4] = nodePositions[j].y;
            posArr[lineIndex * 6 + 5] = nodePositions[j].z;

            // Gradiente índigo/lilás pulsante
            const p = 0.5 + Math.sin(time * 2.0 + lineIndex) * 0.5;
            const r = THREE.MathUtils.lerp(0.39, 0.51, p) * alpha;
            const g = THREE.MathUtils.lerp(0.4, 0.55, p) * alpha;
            const b = THREE.MathUtils.lerp(0.95, 0.97, p) * alpha;

            colArr[lineIndex * 6] = r;
            colArr[lineIndex * 6 + 1] = g;
            colArr[lineIndex * 6 + 2] = b;

            colArr[lineIndex * 6 + 3] = r * 0.8;
            colArr[lineIndex * 6 + 4] = g * 0.8;
            colArr[lineIndex * 6 + 5] = b;

            lineIndex++;
          }
        }
      }

      // Zera o restante do buffer para evitar linhas fantasmas
      for (let k = lineIndex; k < MAX_CONNECTIONS; k++) {
        posArr[k * 6] = 0;
        posArr[k * 6 + 1] = 0;
        posArr[k * 6 + 2] = 0;
        posArr[k * 6 + 3] = 0;
        posArr[k * 6 + 4] = 0;
        posArr[k * 6 + 5] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // B. GRID 3D EM PERSPECTIVA: DESLOCAMENTO REATIVO À DIREÇÃO DO SCROLL (IDA E VOLTA)
      const baseGridSpeed = 1.8 * motionFactor;
      // Quando o usuário rola para cima ou para baixo, o grid acelera ou inverte o sentido
      const gridDirectionalShift = scrollDelta * 40.0;
      const gridOffset = ((time * baseGridSpeed + currentScroll * 12.0) % gridStep);

      groundGridGroup.position.z = -18 + gridOffset;
      ceilingGridGroup.position.z = -18 + gridOffset;

      // Ondulação sutil no grid
      groundGridGroup.rotation.z = Math.sin(time * 0.35) * 0.02 + currentMouseX * 0.04;
      ceilingGridGroup.rotation.z = -Math.sin(time * 0.35) * 0.02 - currentMouseX * 0.04;

      // C. PULSOS NOS CIRCUITOS DIGITAIS
      circuitTracks.forEach((track) => {
        // Pulso se move pelo circuito; velocidade influenciada pelo scroll
        const scrollBoost = Math.abs(scrollVelocity) * 0.08;
        track.progress += (track.speed + scrollBoost) * delta * motionFactor;
        if (track.progress >= 1.0) track.progress = 0;

        const totalPts = track.pathPoints.length;
        const exactIdx = track.progress * (totalPts - 1);
        const idx = Math.floor(exactIdx);
        const frac = exactIdx - idx;

        const p1 = track.pathPoints[idx];
        const p2 = track.pathPoints[Math.min(idx + 1, totalPts - 1)];

        if (p1 && p2) {
          track.pulseSphere.position.lerpVectors(p1, p2, frac);
        }

        // Pulsação de brilho na linha do circuito
        const pulse = 0.25 + Math.sin(time * 3.0 + track.progress * 10) * 0.25;
        track.mat.opacity = pulse;
      });

      // D. ROTAÇÃO GLOBAL E PARALLAX DA CÂMERA CONFORME MOUSE E SCROLL
      nodesGroup.rotation.y = time * 0.04 * motionFactor + currentMouseX * 0.15;
      nodesGroup.rotation.x = Math.sin(time * 0.03) * 0.05 - currentMouseY * 0.1;

      // Câmera oscila sutilmente com o scroll e parallax
      camera.position.x = currentMouseX * 0.6;
      camera.position.y = currentMouseY * 0.45;
      camera.position.z = 12 + Math.sin(currentScroll * Math.PI) * 1.5;
      camera.lookAt(0, 0, -6);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running || document.hidden || !onScreen) return;
      running = true;
      clock.getDelta(); // descarta o tempo parado
      animate();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };
    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        onScreen = Boolean(entries[0]?.isIntersecting);
        if (onScreen) start();
        else stop();
      });
      observer.observe(container);
    }

    start();

    // =========================================================================
    // LIMPEZA E DESALOCAÇÃO
    // =========================================================================
    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      nodesGeo.dispose();
      nodesMat.dispose();
      nodeTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();

      groundGridGeo.dispose();
      groundGridMat.dispose();
      ceilingGridGeo.dispose();
      ceilingGridMat.dispose();

      sphereSharedGeo.dispose();
      sphereMats.forEach((m) => m.dispose());
      circuitTracks.forEach((t) => {
        t.geo.dispose();
        t.mat.dispose();
      });

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
