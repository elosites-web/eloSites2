// Carrega o manifest.json dos assets de movimento (public/assets/flow).
// Contagem de frames, dimensões, vídeos e pôsteres vêm SEMPRE do manifesto:
// nada disso é fixado no código.

export interface FlowScene {
  frames: number;
  width: number;
  height: number;
  poster: string;
  desc?: string;
}

export interface FlowLoopVideo {
  file: string;
  poster: string;
  width: number;
  height: number;
  audio?: boolean;
}

export interface FlowManifest {
  frameNaming?: string;
  scenes: Record<string, FlowScene>;
  loopVideos: Record<string, FlowLoopVideo>;
}

const BASE = '/assets/flow/';

let manifestPromise: Promise<FlowManifest> | null = null;

export function getFlowManifest(): Promise<FlowManifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${BASE}manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`manifest.json: HTTP ${res.status}`);
        return res.json() as Promise<FlowManifest>;
      })
      .catch((err) => {
        manifestPromise = null; // permite nova tentativa depois
        throw err;
      });
  }
  return manifestPromise;
}

export function flowAssetUrl(relativePath: string): string {
  return `${BASE}${relativePath}`;
}

// frame_001.webp, frame_002.webp ... (numeração começa em 1)
export function flowFrameUrl(scene: string, frameNumber: number): string {
  return `${BASE}${scene}/frame_${String(frameNumber).padStart(3, '0')}.webp`;
}
