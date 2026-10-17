import { saveDataEnabled } from './mediaPrefs';
import type { ScreenId } from './types';

type Loader = () => Promise<unknown>;

const screenLoaders: Partial<Record<ScreenId, Loader>> = {
  portfolio: () =>
    Promise.all([
      import('./components/PortfolioSection'),
      import('./components/TestimonialsSection'),
    ]),
  servicos: () => import('./components/ServicesSection'),
  processo: () =>
    Promise.all([
      import('./components/ProcessSection'),
      import('./components/DifferentialsSection'),
    ]),
  orcamento: () => import('./components/ProjectBriefBookingSection'),
  faq: () =>
    Promise.all([
      import('./components/FaqSection'),
      import('./components/ContactCtaSection'),
    ]),
  'parceria-trafego': () => import('./components/PaidTrafficPartnershipSection'),
};

function ignoreFailure(promise: Promise<unknown>): void {
  promise.catch(() => {});
}

export function preloadScreen(screenId: ScreenId): void {
  if (saveDataEnabled()) return;
  const loader = screenLoaders[screenId];
  if (loader) ignoreFailure(loader());
}

export function preloadDeferredChrome(): void {
  if (saveDataEnabled()) return;
  ignoreFailure(
    Promise.all([
      import('./components/LegalModals'),
      import('./components/SitemapModal'),
    ])
  );
}

export function preloadAllScreens(): void {
  if (saveDataEnabled()) return;
  preloadDeferredChrome();
  Object.values(screenLoaders).forEach((loader) => ignoreFailure(loader()));
}
