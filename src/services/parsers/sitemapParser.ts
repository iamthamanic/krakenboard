
import { fetchWithProxy } from '../proxy/proxyFetch';

export class SitemapParser {
  constructor(private baseUrl: string) {}

  async getUrls(): Promise<string[]> {
    try {
      const xml = await fetchWithProxy(`${this.baseUrl}/sitemap.xml`);
      const urls: string[] = [];
      const matches = xml.match(/<loc>(.*?)<\/loc>/g);
      
      if (matches) {
        matches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '');
          if (url.startsWith(this.baseUrl)) {
            urls.push(url);
          }
        });
      }
      
      return [...new Set(urls)];
    } catch (error) {
      console.log("Keine Sitemap gefunden:", error);
      return [];
    }
  }
}
