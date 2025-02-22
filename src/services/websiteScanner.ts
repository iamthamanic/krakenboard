import { toast } from "@/components/ui/use-toast";
import { DiscoveredPage, ScanProgress } from './types/scanner.types';
import { SitemapParser } from './parsers/sitemapParser';
import { FormParser } from './parsers/formParser';
import { LinkParser } from './parsers/linkParser';
import { fetchWithProxy } from './proxy/proxyFetch';

export class WebsiteScanner {
  private visited = new Set<string>();
  private baseUrl: string;
  private onProgress?: (progress: ScanProgress) => void;
  private startTime: number = 0;
  private avgPageScanTime: number = 0;
  private concurrentRequests = 5;
  private requestDelay = 100;

  private sitemapParser: SitemapParser;
  private linkParser: LinkParser;

  constructor(url: string, onProgress?: (progress: ScanProgress) => void) {
    this.baseUrl = new URL(url).origin;
    this.onProgress = onProgress;
    this.sitemapParser = new SitemapParser(this.baseUrl);
    this.linkParser = new LinkParser(this.baseUrl);
  }

  async scanWebsite(): Promise<DiscoveredPage[]> {
    const pages: DiscoveredPage[] = [];
    this.startTime = Date.now();
    
    try {
      const sitemapUrls = await this.sitemapParser.getUrls();
      if (sitemapUrls.length > 0) {
        console.log("Sitemap gefunden, scanne URLs...", sitemapUrls.length);
        await this.processSitemapUrls(sitemapUrls, pages);
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

  private async processSitemapUrls(urls: string[], pages: DiscoveredPage[]) {
    this.updateProgress({
      scannedPages: 0,
      totalPages: urls.length,
      currentUrl: "Starte Scan...",
      estimatedTimeRemaining: 0
    });

    for (let i = 0; i < urls.length; i += this.concurrentRequests) {
      const batch = urls.slice(i, i + this.concurrentRequests);
      const results = await Promise.all(
        batch.map(url => this.scanPage(url))
      );
      
      results.forEach(page => {
        if (page) pages.push(page);
      });

      this.updateProgress({
        scannedPages: Math.min(i + this.concurrentRequests, urls.length),
        totalPages: urls.length,
        currentUrl: batch[batch.length - 1],
        estimatedTimeRemaining: this.estimateTimeRemaining(i + this.concurrentRequests, urls.length)
      });

      await new Promise(resolve => setTimeout(resolve, this.requestDelay));
    }
  }

  private async crawlPage(url: string, pages: DiscoveredPage[]) {
    if (this.visited.has(url)) return;
    this.visited.add(url);

    try {
      const page = await this.scanPage(url);
      if (page) {
        pages.push(page);
        
        const html = await fetchWithProxy(url);
        const links = this.linkParser.parseLinks(html);
        const newLinks = links.filter(link => !this.visited.has(link));
        
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

  private async scanPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const html = await fetchWithProxy(url);
      const titleMatch = /<title>(.*?)<\/title>/.exec(html);
      const title = titleMatch ? titleMatch[1] : url;
      const forms = FormParser.parseFromHtml(html);
      
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

  private formatTimeRemaining(seconds: number): string {
    if (seconds === 0) return "0 Sekunden";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const parts = [];
    
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`);
    }
    if (remainingSeconds > 0) {
      parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'Sekunde' : 'Sekunden'}`);
    }
    
    return parts.join(', ');
  }

  private estimateTimeRemaining(scannedPages: number, totalPages: number): string {
    if (scannedPages === 0) return "Berechne...";
    
    const elapsedTime = Date.now() - this.startTime;
    const avgTimePerPage = elapsedTime / scannedPages;
    this.avgPageScanTime = avgTimePerPage;
    
    const remainingPages = totalPages - scannedPages;
    const estimatedSeconds = Math.ceil((remainingPages * avgTimePerPage / 1000) / this.concurrentRequests);
    
    return this.formatTimeRemaining(estimatedSeconds);
  }
}
