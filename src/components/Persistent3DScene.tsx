import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isInAppBrowser, getOptimalDpr } from '../mediaPrefs';

/**
 * Textura procedural de nó luminoso (sem dependência externa de assets)
 */
function createNodeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(129, 140, 248, 0.95)');
    gradient.addColorStop(0.55, 'rgba(99, 102, 241, 0.55)');
    gradient.addColorStop(0.85, 'rgba(148, 163, 184, 0.15)');
    gradient.addColorStop(1, 'rgba(11, 15, 26, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 48, 48);
  }
  return new THREE.CanvasTexture(canvas);
}

export const Persistent3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const inApp = isInAppBrowser();

    // Configuração de Cena, Névoa Atmosférica e Câmera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060912, 0.016);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 12);

    // Renderer WebGL autônomo com buffer alpha e ACESFilmicToneMapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile && !inApp,
        powerPreference: 'high-performance',
        precision: isMobile || inApp ? 'mediump' : 'highp',
      });
    } catch (err) {
      console.warn('WebGL indisponível; mantendo fundo CSS.', err);
      return;
    }

    const optimalDpr = getOptimalDpr(isMobile, inApp);
    renderer.setPixelRatio(optimalDpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0x0b0f1a, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.2);
    dirLight1.position.set(10, 10, 8);
    scene.add(dirLight1);

    // =========================================================================
    // 1. MALHA DE NÓS 3D COM GEOMETRIA REDUZIDA E CONEXÕES PRÉ-INDEXADAS
    // =========================================================================
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    // Redução drástica de nós para máxima fluidez em mobile e WebViews (Instagram/FB)
    const NODE_COUNT = isMobile || inApp ? 24 : 42;
    const nodeTexture = createNodeGlowTexture();
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    const nodesGeo = new THREE.BufferGeometry();
    const nodePosArray = new Float32Array(NODE_COUNT * 3);
    const nodeColorArray = new Float32Array(NODE_COUNT * 3);

    const indigoCol = new THREE.Color(0x6366f1);
    const lilacCol = new THREE.Color(0x818cf8);
    const slateCol = new THREE.Color(0x94a3b8);

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 18;
      const z = -12 + Math.random() * 18;

      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.018
        )
      );

      nodePosArray[i * 3] = x;
      nodePosArray[i * 3 + 1] = y;
      nodePosArray[i * 3 + 2] = z;

      const rnd = Math.random();
      const col = rnd < 0.5 ? indigoCol : rnd < 0.85 ? lilacCol : slateCol;
      nodeColorArray[i * 3] = col.r;
      nodeColorArray[i * 3 + 1] = col.g;
      nodeColorArray[i * 3 + 2] = col.b;
    }

    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArray, 3));
    nodesGeo.setAttribute('color', new THREE.BufferAttribute(nodeColorArray, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile || inApp ? 0.75 : 0.85,
      map: nodeTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    nodesGroup.add(nodesMesh);

    // Conexões pré-indexadas estaticamente: elimina loop O(N^2) a 60fps na CPU!
    const connectionPairs: [number, number][] = [];
    const MAX_CONNECTIONS = isMobile || inApp ? 28 : 52;

    for (let i = 0; i < NODE_COUNT && connectionPairs.length < MAX_CONNECTIONS; i++) {
      let closestIdx = -1;
      let closestDist = Infinity;
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const d = nodePositions[i].distanceToSquared(nodePositions[j]);
        if (d < 40 && d < closestDist) {
          closestDist = d;
          closestIdx = j;
        }
      }
      if (closestIdx !== -1) {
        connectionPairs.push([i, closestIdx]);
      }
    }

    const actualConnections = connectionPairs.length;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(actualConnections * 2 * 3);
    const lineColors = new Float32Array(actualConnections * 2 * 3);

    // Cores estáticas das conexões geradas uma única vez
    for (let k = 0; k < actualConnections; k++) {
      const [a, b] = connectionPairs[k];
      const isInd = k % 2 === 0;
      const baseCol = isInd ? indigoCol : lilacCol;

      lineColors[k * 6] = baseCol.r * 0.7;
      lineColors[k * 6 + 1] = baseCol.g * 0.7;
      lineColors[k * 6 + 2] = baseCol.b;

      lineColors[k * 6 + 3] = baseCol.r * 0.5;
      lineColors[k * 6 + 4] = baseCol.g * 0.5;
      lineColors[k * 6 + 5] = baseCol.b * 0.9;
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(linesMesh);

    // =========================================================================
    // 2. GRID EM PERSPECTIVA COM GEOMETRIA REDUZIDA (CHÃO E TETO)
    // =========================================================================
    const gridStep = 2.2;
    const gridRows = isMobile || inApp ? 10 : 16;
    const gridCols = isMobile || inApp ? 8 : 14;
    const gridWidth = gridCols * gridStep;
    const gridLength = gridRows * gridStep;

    const groundGridGroup = new THREE.Group();
    scene.add(groundGridGroup);
    groundGridGroup.position.set(0, -4.8, -16);
    groundGridGroup.rotation.x = -Math.PI / 2 + 0.14;

    const groundGridGeo = new THREE.PlaneGeometry(gridWidth, gridLength, gridCols, gridRows);
    const groundGridMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const groundGridMesh = new THREE.Mesh(groundGridGeo, groundGridMat);
    groundGridGroup.add(groundGridMesh);

    // Grid do teto
    const ceilingGridGroup = new THREE.Group();
    scene.add(ceilingGridGroup);
    ceilingGridGroup.position.set(0, 6.2, -16);
    ceilingGridGroup.rotation.x = Math.PI / 2 - 0.14;

    const ceilingGridGeo = new THREE.PlaneGeometry(gridWidth, gridLength, gridCols, gridRows);
    const ceilingGridMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const ceilingGridMesh = new THREE.Mesh(ceilingGridGeo, ceilingGridMat);
    ceilingGridGroup.add(ceilingGridMesh);

    // =========================================================================
    // 3. CIRCUITOS DIGITAIS E FLUXO LEVE DE DADOS
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
    const TRACK_COUNT = isMobile || inApp ? 4 : 7;
    const sphereSharedGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const sphereMats: THREE.MeshBasicMaterial[] = [];

    for (let t = 0; t < TRACK_COUNT; t++) {
      const waypoints: THREE.Vector3[] = [];
      let curX = (Math.random() - 0.5) * 24;
      let curY = (Math.random() - 0.5) * 14;
      let curZ = -20 + Math.random() * 10;
      waypoints.push(new THREE.Vector3(curX, curY, curZ));

      const segments = 3 + Math.floor(Math.random() * 3);
      for (let s = 0; s < segments; s++) {
        const axis = Math.floor(Math.random() * 3);
        const dist = 3 + Math.random() * 5;
        if (axis === 0) curX += (Math.random() > 0.5 ? 1 : -1) * dist;
        else if (axis === 1) curY += (Math.random() > 0.5 ? 1 : -1) * dist;
        else curZ += Math.random() * dist;
        waypoints.push(new THREE.Vector3(curX, curY, curZ));
      }

      const curve = new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.2);
      const points = curve.getPoints(24);
      const trackGeo = new THREE.BufferGeometry().setFromPoints(points);

      const isIndigo = t % 2 === 0;
      const trackCol = isIndigo ? 0x6366f1 : 0x818cf8;
      const trackMat = new THREE.LineBasicMaterial({
        color: trackCol,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      });

      const trackLine = new THREE.Line(trackGeo, trackMat);
      circuitsGroup.add(trackLine);

      const sMat = new THREE.MeshBasicMaterial({ color: trackCol });
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
        speed: 0.08 + Math.random() * 0.1,
      });
    }

    // =========================================================================
    // 4. SCROLL PASSIVO E INTERAÇÃO COM INTERPOLAÇÃO OTIMIZADA
    // =========================================================================
    let targetScroll = 0;
    let currentScroll = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let time = 0;
    let scrollTicking = false;

    const handleScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          targetScroll = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
          scrollTicking = false;
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Em mobile/touch o pointer move é ignorado para economizar bateria
      if (isMobile) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(getOptimalDpr(window.innerWidth < 768, inApp));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // =========================================================================
    // 5. LOOP DE ANIMAÇÃO DE ALTA PERFORMANCE (ZERO O(N^2) NA CPU)
    // =========================================================================
    let animationFrameId = 0;
    let running = false;
    let onScreen = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const motionFactor = prefersReducedMotion ? 0.2 : 1.0;
      time += delta * motionFactor;

      // Amortecimento suave com GPU
      currentScroll += (targetScroll - currentScroll) * 0.1;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // A. ATUALIZAÇÃO LEVE DOS NÓS
      const positions = nodesGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < NODE_COUNT; i++) {
        const v = nodeVelocities[i];
        const driftX = Math.sin(time * 0.6 + i * 0.4) * 0.01 * motionFactor;
        const driftY = Math.cos(time * 0.5 + i * 0.4) * 0.01 * motionFactor;

        nodePositions[i].x += v.x * motionFactor + driftX;
        nodePositions[i].y += v.y * motionFactor + driftY;
        nodePositions[i].z += v.z * motionFactor;

        if (nodePositions[i].x < -16 || nodePositions[i].x > 16) v.x *= -1;
        if (nodePositions[i].y < -11 || nodePositions[i].y > 11) v.y *= -1;
        if (nodePositions[i].z < -22) nodePositions[i].z = 5;
        if (nodePositions[i].z > 6) nodePositions[i].z = -20;

        positions[i * 3] = nodePositions[i].x;
        positions[i * 3 + 1] = nodePositions[i].y;
        positions[i * 3 + 2] = nodePositions[i].z;
      }
      nodesGeo.attributes.position.needsUpdate = true;

      // B. CONEXÕES DIRETAS POR ÍNDICE (Execução instantânea sem nenhum loop O(N^2)!)
      const posArr = lineGeo.attributes.position.array as Float32Array;
      for (let k = 0; k < actualConnections; k++) {
        const [a, b] = connectionPairs[k];
        const na = nodePositions[a];
        const nb = nodePositions[b];

        posArr[k * 6] = na.x;
        posArr[k * 6 + 1] = na.y;
        posArr[k * 6 + 2] = na.z;

        posArr[k * 6 + 3] = nb.x;
        posArr[k * 6 + 4] = nb.y;
        posArr[k * 6 + 5] = nb.z;
      }
      lineGeo.attributes.position.needsUpdate = true;

      // C. GRID DESLOCANDO SUAVEMENTE (via coordenadas de grupo em GPU)
      const baseGridSpeed = 1.4 * motionFactor;
      const gridOffset = (time * baseGridSpeed + currentScroll * 10.0) % gridStep;

      groundGridGroup.position.z = -16 + gridOffset;
      ceilingGridGroup.position.z = -16 + gridOffset;

      // D. PULSOS NOS CIRCUITOS
      for (let t = 0; t < circuitTracks.length; t++) {
        const track = circuitTracks[t];
        track.progress += track.speed * delta * motionFactor;
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
      }

      // E. CÂMERA E ROTAÇÃO REATIVA
      nodesGroup.rotation.y = time * 0.035 * motionFactor + currentMouseX * 0.12;
      nodesGroup.rotation.x = Math.sin(time * 0.025) * 0.04 - currentMouseY * 0.08;
      nodesGroup.position.z = currentScroll * 2.5;

      camera.position.x = currentMouseX * 0.5;
      camera.position.y = currentMouseY * 0.35;
      camera.position.z = 12 + Math.sin(currentScroll * Math.PI) * 1.2;
      camera.lookAt(0, 0, -5);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running || document.hidden || !onScreen) return;
      running = true;
      clock.getDelta();
      animate();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', handleVisibility);

    // Suporte aos eventos de perda e restauração de contexto WebGL
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const handleContextRestored = () => {
      start();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

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
    // LIMPEZA E DESALOCAÇÃO COMPLETA DE MEMÓRIA
    // =========================================================================
    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-80"
      style={{ willChange: 'transform' }}
    />
  );
};
