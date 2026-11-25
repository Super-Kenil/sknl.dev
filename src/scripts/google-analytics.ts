declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function initializeGoogleAnalytics(measurementId: string): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  document.addEventListener('astro:page-load', () => {
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
    });
  });
}
