import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getMotionTier, shouldReduceMedia, webglSupported } from '../mediaPrefs';

interface FluidRippleBackgroundProps {
  className?: string;
}

export const FluidRippleBackground: React.FC<FluidRippleBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCssFallback, setUseCssFallback] = useState<boolean>(() => {
    return shouldReduceMedia() || !webglSupported() || getMotionTier() === 'none';
  });

  useEffect(() => {
    if (useCssFallback) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number | null = null;
    let isPaused = false;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 24;

      // 1. Orbes fluidos com materiais customizados de gradiente aditivo
      const orbsGroup = new THREE.Group();
      scene.add(orbsGroup);

      const orbColors = [
        { color: 0x06b6d4, x: -6, y: 4, z: -4, radius: 4.5, speed: 0.0006 }, // Ciano
        { color: 0x6366f1, x: 7, y: -3, z: -5, radius: 5.5, speed: 0.0008 }, // Indigo
        { color: 0x8b5cf6, x: 2, y: 5, z: -8, radius: 6.0, speed: 0.0005 },  // Violeta
        { color: 0x0ea5e9, x: -4, y: -5, z: -6, radius: 4.0, speed: 0.0007 }, // Azul céu
      ];

      const orbMeshes: { mesh: THREE.Mesh; initial: { x: number; y: number; z: number; speed: number } }[] = [];

      orbColors.forEach((orbData) => {
        const geometry = new THREE.SphereGeometry(orbData.radius, 24, 24);
        const material = new THREE.MeshBasicMaterial({
          color: orbData.color,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(orbData.x, orbData.y, orbData.z);
        orbsGroup.add(mesh);
        orbMeshes.push({ mesh, initial: orbData });
      });

      // 2. Malha de Ondulação Fluida (Fluid Ripple Mesh)
      const planeGeometry = new THREE.PlaneGeometry(36, 26, 32, 32);
      const positionAttr = planeGeometry.attributes.position;
      const initialPositions = new Float32Array(positionAttr.array);

      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });

      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.position.z = -2;
      scene.add(planeMesh);

      // 3. Partículas flutuantes de profundidade (stardust sutil)
      const particleCount = 70;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 40;
        particlePos[i + 1] = (Math.random() - 0.5) * 30;
        particlePos[i + 2] = (Math.random() - 0.5) * 20;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.14,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Interação do mouse / toque para ripple
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      const handlePointer = (e: MouseEvent | TouchEvent) => {
        let clientX = 0;
        let clientY = 0;
        if ('touches' in e && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }
        targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = -(clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handlePointer, { passive: true });
      window.addEventListener('touchmove', handlePointer, { passive: true });

      // Resize observer
      const handleResize = () => {
        if (!renderer || !camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // Visibility change para poupar bateria quando aba minimizada
      const handleVisibilityChange = () => {
        isPaused = document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Loop de animação
      let clock = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (isPaused || !renderer || !scene || !camera) return;

        clock += 0.015;

        // Suave interpolação do cursor
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;

        // Movimento harmônico dos orbes
        orbMeshes.forEach(({ mesh, initial }, idx) => {
          const t = clock * initial.speed * 1000 + idx;
          mesh.position.x = initial.x + Math.sin(t * 0.8) * 1.8 + currentMouseX * 1.2;
          mesh.position.y = initial.y + Math.cos(t * 0.6) * 1.6 + currentMouseY * 1.2;
          mesh.scale.setScalar(1 + Math.sin(t * 0.5) * 0.12);
        });

        // Ondulação da malha baseada em tempo e cursor (fluid ripples)
        const pos = planeGeometry.attributes.position;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const vx = initialPositions[i];
          const vy = initialPositions[i + 1];
          // Distância ao cursor
          const distToCursor = Math.hypot(vx - currentMouseX * 12, vy - currentMouseY * 10);
          const ripple = Math.sin(distToCursor * 0.8 - clock * 2.2) * 0.45;
          const harmonic = Math.sin(vx * 0.3 + clock) * Math.cos(vy * 0.3 + clock) * 0.35;
          arr[i + 2] = ripple + harmonic;
        }
        pos.needsUpdate = true;

        // Rotação suave do sistema de partículas
        particleSystem.rotation.y = clock * 0.02;
        particleSystem.rotation.x = clock * 0.01;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handlePointer);
        window.removeEventListener('touchmove', handlePointer);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        // Desalocação Three.js
        planeGeometry.dispose();
        planeMaterial.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        orbMeshes.forEach(({ mesh }) => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });
        renderer?.dispose();
      };
    } catch {
      // Fallback gracioso para gradiente CSS
      setUseCssFallback(true);
    }
  }, [useCssFallback]);

  if (useCssFallback) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden ${className}`}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-cyan-600/10 blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/12 blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-violet-600/08 blur-[150px]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
