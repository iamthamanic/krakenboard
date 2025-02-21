
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
  steps?: number;
  classes?: string[];
}

interface ScanProgress {
  scannedPages: number;
  totalPages: number;
  currentUrl: string;
  estimatedTimeRemaining: number;
}

export class WebsiteScanner {
  private visited = new Set<string>();
  private baseUrl: string;
  private proxyUrl = "https://api.allorigins.win/raw?url="; // Änderung zu raw für schnellere Verarbeitung
  private onProgress?: (progress: ScanProgress) => void;
  private startTime: number = 0;
  private avgPageScanTime: number = 0;
  private concurrentRequests = 5; // Anzahl paralleler Requests
  private requestDelay = 100; // Verzögerung zwischen Requests in ms

  constructor(url: string, onProgress?: (progress: ScanProgress) => void) {
    this.baseUrl = new URL(url).origin;
    this.onProgress = onProgress;
  }

  async scanWebsite(): Promise<DiscoveredPage[]> {
    const pages: DiscoveredPage[] = [];
    this.startTime = Date.now();
    
    try {
      // Versuche zuerst die sitemap.xml zu lesen
      const sitemapUrls = await this.getSitemapUrls();
      if (sitemapUrls.length > 0) {
        console.log("Sitemap gefunden, scanne URLs...", sitemapUrls.length);
        
        // Initialer Fortschritt
        this.updateProgress({
          scannedPages: 0,
          totalPages: sitemapUrls.length,
          currentUrl: "Starte Scan...",
          estimatedTimeRemaining: 0
        });

        // Batch-Processing der URLs
        for (let i = 0; i < sitemapUrls.length; i += this.concurrentRequests) {
          const batch = sitemapUrls.slice(i, i + this.concurrentRequests);
          const results = await Promise.all(
            batch.map(url => this.scanPage(url))
          );
          
          results.forEach(page => {
            if (page) pages.push(page);
          });

          // Update Fortschritt
          this.updateProgress({
            scannedPages: Math.min(i + this.concurrentRequests, sitemapUrls.length),
            totalPages: sitemapUrls.length,
            currentUrl: batch[batch.length - 1],
            estimatedTimeRemaining: this.estimateTimeRemaining(i + this.concurrentRequests, sitemapUrls.length)
          });

          // Kleine Pause zwischen Batches
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
      } else {
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

  private async fetchWithProxy(url: string): Promise<string> {
    const response = await fetch(this.proxyUrl + encodeURIComponent(url));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text(); // Direkte Text-Antwort statt JSON-Parsing
  }

  private async getSitemapUrls(): Promise<string[]> {
    try {
      const xml = await this.fetchWithProxy(`${this.baseUrl}/sitemap.xml`);
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
      
      return [...new Set(urls)]; // Entferne Duplikate
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
        
        const links = await this.getPageLinks(url);
        const newLinks = links.filter(link => !this.visited.has(link));
        
        // Batch-Processing für Crawler
        for (let i = 0; i < newLinks.length; i += this.concurrentRequests) {
          const batch = newLinks.slice(i, i + this.concurrentRequests);
          await Promise.all(
            batch.map(link => this.crawlPage(link, pages))
          );
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
      }
    } catch (error) {
      console.error(`Fehler beim Crawlen von ${url}:`, error);
    }
  }

  private async getPageLinks(url: string): Promise<string[]> {
    try {
      const html = await this.fetchWithProxy(url);
      const links: string[] = [];
      
      // Optimierte Regex für Link-Extraktion
      const regex = /href="([^"]+)"/g;
      let match;
      
      while ((match = regex.exec(html)) !== null) {
        const href = match[1];
        if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
          const fullUrl = href.startsWith('/') ? `${this.baseUrl}${href}` : href;
          if (!fullUrl.includes('#') && !fullUrl.endsWith('.pdf')) {
            links.push(fullUrl);
          }
        }
      }
      
      return [...new Set(links)];
    } catch (error) {
      console.error(`Fehler beim Extrahieren der Links von ${url}:`, error);
      return [];
    }
  }

  private async scanPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const html = await this.fetchWithProxy(url);
      
      // Optimierte Titel-Extraktion
      const titleMatch = /<title>(.*?)<\/title>/.exec(html);
      const title = titleMatch ? titleMatch[1] : url;
      
      // Optimierte Formular-Erkennung
      const forms: FormElement[] = [];
      const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/g) || [];
      
      formMatches.forEach(formHtml => {
        const form: FormElement = {
          id: (formHtml.match(/id="([^"]*)"/) || [])[1],
          action: (formHtml.match(/action="([^"]*)"/) || [])[1],
          method: (formHtml.match(/method="([^"]*)"/) || [])[1] || 'get',
          fields: (formHtml.match(/<input[^>]*>/g) || []).length,
          steps: (formHtml.match(/step|wizard|multi|stage/gi) || []).length || 1,
          classes: ((formHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/)
        };
        forms.push(form);
      });
      
      // Suche auch nach dynamischen Formularen
      const divFormMatches = html.match(/<div[^>]*form[^>]*>[\s\S]*?<\/div>/g) || [];
      divFormMatches.forEach(divHtml => {
        const inputCount = (divHtml.match(/<input[^>]*>/g) || []).length;
        if (inputCount > 0) {
          forms.push({
            fields: inputCount,
            steps: (divHtml.match(/step|wizard|multi|stage/gi) || []).length || 1,
            classes: ((divHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/),
            method: 'dynamic'
          });
        }
      });
      
      return { url, title, forms };
    } catch (error) {
      console.error(`Fehler beim Scannen von ${url}:`, error);
      return null;
    }
  }

  private updateProgress(progress: ScanProgress) {
    if (this.onProgress) {
      this.onProgress(progress);
    }
  }

  private estimateTimeRemaining(scannedPages: number, totalPages: number): number {
    if (scannedPages === 0) return 0;
    
    const elapsedTime = Date.now() - this.startTime;
    const avgTimePerPage = elapsedTime / scannedPages;
    this.avgPageScanTime = avgTimePerPage;
    
    const remainingPages = totalPages - scannedPages;
    const estimatedTime = Math.round(remainingPages * avgTimePerPage / 1000);
    
    // Berücksichtige parallele Verarbeitung
    return Math.ceil(estimatedTime / this.concurrentRequests);
  }
}
