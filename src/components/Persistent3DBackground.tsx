import React, { Suspense, lazy, useEffect, useState } from 'react';
import { webglSupported } from '../mediaPrefs';
import type { ScreenId } from '../types';

// O chunk do Three.js só é baixado quando <Persistent3DScene /> é realmente renderizado.
const Persistent3DScene = lazy(() =>
  import('./Persistent3DScene').then((mod) => ({ default: mod.Persistent3DScene }))
);

/**
 * Skeleton loading global do fundo 3D:
 * Exibe um gradiente suave em paleta violeta/púrpura futurista com toques em azul neon
 * e padrão de grade técnica em tela cheia enquanto a cena 3D inicializa.
 */
export const Persistent3DSkeleton: React.FC<{ isLoaded?: boolean }> = ({ isLoaded = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Base escura profunda */}
      <div className="absolute inset-0 bg-[#050711]" />
      {/* Brilhos atmosféricos em violeta futurista e azul neon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,92,246,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_65%,rgba(59,130,246,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(168,85,247,0.08),transparent_60%)]" />
      {/* Padrão de grade técnica */}
      <div className="absolute inset-0 tech-grid-pattern opacity-50" />
      {/* Horizonte suave em perspectiva com brilho azul/violeta */}
      <div className="absolute top-[65%] inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </div>
  );
};

// Um erro na cena 3D nunca pode derrubar a página: o fundo é só decorativo.
interface BoundaryProps {
  children?: React.ReactNode;
}
interface BoundaryState {
  failed: boolean;
}

class Scene3DErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  declare props: BoundaryProps;
  declare state: BoundaryState;

  constructor(props: BoundaryProps) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Fundo 3D desativado após erro:', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface Persistent3DBackgroundProps {
  isMenuOpen?: boolean;
  currentScreen?: ScreenId;
}

/**
 * Fundo 3D persistente com Skeleton Global e carregamento assíncrono em tempo ocioso
 */
export const Persistent3DBackground: React.FC<Persistent3DBackgroundProps> = ({
  isMenuOpen = false,
  currentScreen = 'home',
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isSceneMounted, setIsSceneMounted] = useState(false);

  useEffect(() => {
    if (!webglSupported()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setShouldLoad(true);
    };

    const useIdle = typeof window.requestIdleCallback === 'function';
    const handle = useIdle
      ? window.requestIdleCallback(start, { timeout: 300 })
      : window.setTimeout(start, 50);

    return () => {
      cancelled = true;
      if (useIdle) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  return (
    <>
      {/* Skeleton loading global exibido instantaneamente na carga */}
      <Persistent3DSkeleton isLoaded={isSceneMounted} />

      {/* Cena 3D interativa montada após resolução em tempo ocioso */}
      {shouldLoad && (
        <Scene3DErrorBoundary>
          <Suspense fallback={null}>
            <Persistent3DScene
              onMounted={() => setIsSceneMounted(true)}
              isMenuOpen={isMenuOpen}
              currentScreen={currentScreen}
            />
          </Suspense>
        </Scene3DErrorBoundary>
      )}
    </>
  );
};

