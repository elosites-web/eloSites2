// Preferências/limitações do aparelho usadas para decidir se animações pesadas devem rodar.

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function saveDataEnabled(): boolean {
  try {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    return Boolean(conn && conn.saveData);
  } catch {
    return false;
  }
}

export function lowEndDevice(): boolean {
  try {
    return typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  } catch {
    return false;
  }
}

export function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function isInAppBrowser(): boolean {
  try {
    const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    return /FBAN|FBAV|Instagram|FB_IAB|FBSS|TikTok|musical_ly|Line\/|Snapchat/i.test(ua);
  } catch {
    return false;
  }
}

export function getOptimalDpr(isMobile: boolean, inApp: boolean): number {
  if (inApp || isMobile) return 1.0;
  return Math.min(window.devicePixelRatio || 1, 1.35);
}

// true quando animações pesadas (scrub de frames, vídeo, 3D) NÃO devem rodar
export function shouldReduceMedia(): boolean {
  return prefersReducedMotion() || saveDataEnabled();
}
