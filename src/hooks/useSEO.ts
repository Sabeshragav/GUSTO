import { useEffect } from 'react';
import { getSEO } from '../data/seo';

export function useSEO(pageId: string) {
  useEffect(() => {
    const seo = getSEO(pageId);
    
    // Update Title
    document.title = seo.title;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Tags
    updateMeta('description', seo.description);
    if (seo.keywords) {
      updateMeta('keywords', seo.keywords.join(', '));
    }
    
    // Open Graph
    updateMeta('og:title', seo.title);
    updateMeta('og:description', seo.description);
    if (seo.ogImage) {
      updateMeta('og:image', seo.ogImage);
    }

    // Cleanup (optional, resetting to default could be annoying if switching quickly, 
    // but good for single-page feel. For now, we let the next component overwrite it)
  }, [pageId]);
}
