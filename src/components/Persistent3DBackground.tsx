import React, { Suspense, lazy, useEffect, useState } from 'react';
import { webglSupported } from '../mediaPrefs';

// O chunk do Three.js só é baixado quando <Persistent3DScene /> é realmente renderizado.
const Persistent3DScene = lazy(() =>
  import('./Persistent3DScene').then((mod) => ({ default: mod.Persistent3DScene }))
);

/**
 * Skeleton loading global do fundo 3D:
 * Exibe um gradiente suave com padrão de grade sutil em tela cheia enquanto a cena 3D inicializa,
 * eliminando qualquer flash ou travamento visual na carga inicial da página.
 */
export const Persistent3DSkeleton: React.FC<{ isLoaded?: boolean }> = ({ isLoaded = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Base escura e gradiente suave central */}
      <div className="absolute inset-0 bg-[#060912]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.08),transparent_60%)]" />
      {/* Padrão de grade sutil para continuidade estética */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60" />
      {/* Horizonte suave em perspectiva */}
      <div className="absolute top-[65%] inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
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
}

/**
 * Fundo 3D com Skeleton Global e carregamento assíncrono em tempo ocioso
 */
export const Persistent3DBackground: React.FC<Persistent3DBackgroundProps> = ({ isMenuOpen = false }) => {
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
            <Persistent3DScene onMounted={() => setIsSceneMounted(true)} isMenuOpen={isMenuOpen} />
          </Suspense>
        </Scene3DErrorBoundary>
      )}
    </>
  );
};
