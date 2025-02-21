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
  private proxyUrl = "https://api.allorigins.win/get?url=";
  private onProgress?: (progress: ScanProgress) => void;
  private startTime: number = 0;
  private avgPageScanTime: number = 0;

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
        console.log("Sitemap gefunden, scanne URLs...", sitemapUrls);
        
        // Initialer Fortschritt
        this.updateProgress({
          scannedPages: 0,
          totalPages: sitemapUrls.length,
          currentUrl: "Starte Scan...",
          estimatedTimeRemaining: this.estimateTimeRemaining(0, sitemapUrls.length)
        });
        
        for (let i = 0; i < sitemapUrls.length; i++) {
          const url = sitemapUrls[i];
          const page = await this.scanPage(url);
          if (page) pages.push(page);
          
          // Update Fortschritt
          this.updateProgress({
            scannedPages: i + 1,
            totalPages: sitemapUrls.length,
            currentUrl: url,
            estimatedTimeRemaining: this.estimateTimeRemaining(i + 1, sitemapUrls.length)
          });
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

  private async fetchWithProxy(url: string): Promise<string> {
    const response = await fetch(this.proxyUrl + encodeURIComponent(url));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.contents;
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
      
      return urls;
    } catch (error) {
      console.log("Keine Sitemap gefunden:", error);
      return [];
    }
  }

  private async crawlPage(url: string, pages: DiscoveredPage[]) {
    if (this.visited.has(url)) return;
    this.visited.add(url);
    console.log("Crawle Seite:", url);

    try {
      const page = await this.scanPage(url);
      if (page) {
        pages.push(page);
        
        // Parse Links und crawle weitere Seiten
        const links = await this.getPageLinks(url);
        console.log("Gefundene Links:", links);
        
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
      const html = await this.fetchWithProxy(url);
      const links: string[] = [];
      
      // Finde alle href Attribute
      const matches = html.match(/href="([^"]+)"/g);
      if (matches) {
        matches.forEach(match => {
          const href = match.replace(/href="|"/g, '');
          if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
            const fullUrl = href.startsWith('/') ? `${this.baseUrl}${href}` : href;
            if (!fullUrl.includes('#') && !fullUrl.endsWith('.pdf')) { // Filtere Anker und PDFs
              links.push(fullUrl);
            }
          }
        });
      }
      
      return [...new Set(links)]; // Entferne Duplikate
    } catch (error) {
      console.error(`Fehler beim Extrahieren der Links von ${url}:`, error);
      return [];
    }
  }

  private async scanPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const html = await this.fetchWithProxy(url);
      console.log(`Scanne Seite ${url}, HTML Länge: ${html.length}`);
      
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
          const classMatch = formHtml.match(/class="([^"]*)"/);
          
          // Zähle Input-Felder und versuche mehrstufige Formulare zu erkennen
          const inputCount = (formHtml.match(/<input[^>]*>/g) || []).length;
          const stepElements = formHtml.match(/step|wizard|multi|stage/gi);
          const steps = stepElements ? stepElements.length : 1;
          
          forms.push({
            id: idMatch ? idMatch[1] : undefined,
            action: actionMatch ? actionMatch[1] : undefined,
            method: methodMatch ? methodMatch[1] : 'get',
            fields: inputCount,
            steps: steps,
            classes: classMatch ? classMatch[1].split(/\s+/) : []
          });
        });
      }
      
      // Suche auch nach dynamischen Formularen ohne <form> Tag
      const divFormMatches = html.match(/<div[^>]*form[^>]*>[\s\S]*?<\/div>/g);
      if (divFormMatches) {
        divFormMatches.forEach(divHtml => {
          const inputCount = (divHtml.match(/<input[^>]*>/g) || []).length;
          if (inputCount > 0) {
            const classMatch = divHtml.match(/class="([^"]*)"/);
            const stepElements = divHtml.match(/step|wizard|multi|stage/gi);
            
            forms.push({
              fields: inputCount,
              steps: stepElements ? stepElements.length : 1,
              classes: classMatch ? classMatch[1].split(/\s+/) : [],
              method: 'dynamic'
            });
          }
        });
      }
      
      console.log(`Gefundene Formulare auf ${url}:`, forms);
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
    return Math.round(remainingPages * avgTimePerPage / 1000); // Sekunden
  }
}
