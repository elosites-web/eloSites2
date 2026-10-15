import React, { Suspense, lazy, useEffect, useState } from 'react';
import { lowEndDevice, shouldReduceMedia, webglSupported } from '../mediaPrefs';

// O chunk do Three.js só é baixado quando <Persistent3DScene /> é realmente renderizado.
const Persistent3DScene = lazy(() =>
  import('./Persistent3DScene').then((mod) => ({ default: mod.Persistent3DScene }))
);

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

/**
 * Fundo 3D opcional:
 * - não carrega (nem baixa o Three.js) com movimento reduzido, saveData,
 *   aparelho fraco (hardwareConcurrency <= 4) ou sem WebGL;
 * - carrega só depois da primeira renderização, em tempo ocioso.
 */
export const Persistent3DBackground: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!webglSupported()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setShouldLoad(true);
    };

    const useIdle = typeof window.requestIdleCallback === 'function';
    const handle = useIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 400);

    return () => {
      cancelled = true;
      if (useIdle) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Scene3DErrorBoundary>
      <Suspense fallback={null}>
        <Persistent3DScene />
      </Suspense>
    </Scene3DErrorBoundary>
  );
};
