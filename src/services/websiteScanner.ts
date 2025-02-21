
import { toast } from "@/components/ui/use-toast";

interface DiscoveredPage {
  url: string;
  title: string;
  forms: FormElement[];
}

interface FormElement {
  id?: string;
  action?: string;
  method?: string;
  fields: number;
}

export class WebsiteScanner {
  private visited = new Set<string>();
  private baseUrl: string;

  constructor(url: string) {
    this.baseUrl = new URL(url).origin;
  }

  async scanWebsite(): Promise<DiscoveredPage[]> {
    const pages: DiscoveredPage[] = [];
    
    try {
      // Versuche zuerst die sitemap.xml zu lesen
      const sitemapUrls = await this.getSitemapUrls();
      if (sitemapUrls.length > 0) {
        console.log("Sitemap gefunden, scanne URLs...");
        for (const url of sitemapUrls) {
          const page = await this.scanPage(url);
          if (page) pages.push(page);
        }
      } else {
        // Wenn keine Sitemap vorhanden, starte mit der Hauptseite
        console.log("Keine Sitemap gefunden, starte Crawler...");
        await this.crawlPage(this.baseUrl, pages);
      }
      
      toast({
        title: "Website-Scan abgeschlossen",
        description: `${pages.length} Seiten gefunden`
      });
      
      return pages;
    } catch (error) {
      console.error("Scan-Fehler:", error);
      toast({
        title: "Scan-Fehler",
        description: "Website konnte nicht vollständig gescannt werden",
        variant: "destructive"
      });
      return pages;
    }
  }

  private async getSitemapUrls(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sitemap.xml`);
      if (!response.ok) return [];
      
      const text = await response.text();
      const urls: string[] = [];
      const matches = text.match(/<loc>(.*?)<\/loc>/g);
      
      if (matches) {
        matches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '');
          if (url.startsWith(this.baseUrl)) {
            urls.push(url);
          }
        });
      }
      
      return urls;
    } catch (error) {
      console.log("Keine Sitemap gefunden:", error);
      return [];
    }
  }

  private async crawlPage(url: string, pages: DiscoveredPage[]) {
    if (this.visited.has(url)) return;
    this.visited.add(url);

    try {
      const page = await this.scanPage(url);
      if (page) {
        pages.push(page);
        
        // Parse Links und crawle weitere Seiten
        const links = await this.getPageLinks(url);
        for (const link of links) {
          if (link.startsWith(this.baseUrl)) {
            await this.crawlPage(link, pages);
          }
        }
      }
    } catch (error) {
      console.error(`Fehler beim Crawlen von ${url}:`, error);
    }
  }

  private async getPageLinks(url: string): Promise<string[]> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const links: string[] = [];
      
      const matches = html.match(/href="([^"]+)"/g);
      if (matches) {
        matches.forEach(match => {
          const href = match.replace(/href="|"/g, '');
          if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
            const fullUrl = href.startsWith('/') ? `${this.baseUrl}${href}` : href;
            links.push(fullUrl);
          }
        });
      }
      
      return links;
    } catch (error) {
      console.error(`Fehler beim Extrahieren der Links von ${url}:`, error);
      return [];
    }
  }

  private async scanPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extrahiere Titel
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : url;
      
      // Finde Formulare
      const forms: FormElement[] = [];
      const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/g);
      
      if (formMatches) {
        formMatches.forEach(formHtml => {
          const actionMatch = formHtml.match(/action="([^"]*)"/);
          const methodMatch = formHtml.match(/method="([^"]*)"/);
          const idMatch = formHtml.match(/id="([^"]*)"/);
          const inputCount = (formHtml.match(/<input[^>]*>/g) || []).length;
          
          forms.push({
            id: idMatch ? idMatch[1] : undefined,
            action: actionMatch ? actionMatch[1] : undefined,
            method: methodMatch ? methodMatch[1] : 'get',
            fields: inputCount
          });
        });
      }
      
      return { url, title, forms };
    } catch (error) {
      console.error(`Fehler beim Scannen von ${url}:`, error);
      return null;
    }
  }
}
