
import { fetchWithProxy } from '../proxy/proxyFetch';

export class SitemapParser {
  static async parse(baseUrl: string): Promise<string[]> {
    try {
      const xml = await fetchWithProxy(`${baseUrl}/sitemap.xml`);
      const urls: string[] = [];
      const matches = xml.match(/<loc>(.*?)<\/loc>/g);
      
      if (matches) {
        matches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '');
          if (url.startsWith(baseUrl)) {
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
