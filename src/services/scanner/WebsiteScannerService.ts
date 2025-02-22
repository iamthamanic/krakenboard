
import { ScanProgress, DiscoveredPage } from '../types/scanner.types';
import { FormParser } from '../parsers/formParser';
import { LinkParser } from '../parsers/linkParser';
import { SitemapParser } from '../parsers/sitemapParser';

export class WebsiteScannerService {
  private url: string;
  private onProgress?: (progress: ScanProgress) => void;
  private options: any;
  private visitedUrls: Set<string> = new Set();
  private queue: string[] = [];
  private baseUrl: string;

  constructor(url: string, onProgress?: (progress: ScanProgress) => void, options = {}) {
    this.url = url;
    this.onProgress = onProgress;
    this.options = options;
    this.baseUrl = new URL(url).origin;
  }

  async scanWebsite(): Promise<DiscoveredPage[]> {
    try {
      const startTime = Date.now();
      let scannedPages = 0;
      const discoveredPages: DiscoveredPage[] = [];

      // Versuche zuerst die Sitemap zu scannen
      const sitemapUrls = await SitemapParser.parse(this.baseUrl);
      this.queue.push(...sitemapUrls);

      // Füge die Start-URL hinzu, falls sie nicht in der Sitemap war
      if (!this.queue.includes(this.url)) {
        this.queue.push(this.url);
      }

      while (this.queue.length > 0 && (!this.options.singleUrlOnly || scannedPages === 0)) {
        const currentUrl = this.queue.shift()!;
        
        if (this.shouldSkipUrl(currentUrl)) {
          continue;
        }

        this.visitedUrls.add(currentUrl);
        scannedPages++;

        this.updateProgress(startTime, scannedPages, currentUrl);

        const page = await this.crawlPage(currentUrl);
        if (page) {
          await this.processDiscoveredPage(page, discoveredPages);

          if (!this.options.singleUrlOnly) {
            await this.queueNewUrls(page);
          }
        }
      }

      return discoveredPages;
    } catch (error) {
      console.error('Error scanning website:', error);
      return [];
    }
  }

  private async crawlPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const forms = FormParser.parseFromHtml(html, url);
      
      return {
        url,
        title: html.match(/<title>(.*?)<\/title>/)?.[1] || url,
        forms,
        lastSeenAt: new Date()
      };
    } catch (error) {
      console.error(`Error crawling page ${url}:`, error);
      return null;
    }
  }

  private async processDiscoveredPage(page: DiscoveredPage, discoveredPages: DiscoveredPage[]) {
    for (const form of page.forms) {
      const successPage = await FormParser.detectThankYouPage(form, this.baseUrl);
      if (successPage) {
        form.successPage = successPage;
      }
    }
    discoveredPages.push(page);
  }

  private async queueNewUrls(page: DiscoveredPage) {
    const newUrls = await this.extractLinks(page);
    for (const url of newUrls) {
      if (!this.visitedUrls.has(url) && !this.queue.includes(url)) {
        this.queue.push(url);
      }
    }
  }

  private async extractLinks(page: DiscoveredPage): Promise<string[]> {
    try {
      const response = await fetch(page.url);
      const html = await response.text();
      return LinkParser.extractLinks(html, this.baseUrl).filter(url => this.isValidUrl(url));
    } catch (error) {
      console.error(`Error extracting links from ${page.url}:`, error);
      return [];
    }
  }

  private shouldSkipUrl(url: string): boolean {
    if (this.visitedUrls.has(url)) return true;
    if (!this.isValidUrl(url)) return true;
    
    const { includedUrls, excludedUrls } = this.options;
    
    if (includedUrls?.length > 0 && !includedUrls.some(pattern => url.includes(pattern))) {
      return true;
    }
    
    if (excludedUrls?.length > 0 && excludedUrls.some(pattern => url.includes(pattern))) {
      return true;
    }
    
    return false;
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin === this.baseUrl && !url.includes('#');
    } catch {
      return false;
    }
  }

  private updateProgress(startTime: number, scannedPages: number, currentUrl: string) {
    if (this.onProgress) {
      const elapsedTime = Date.now() - startTime;
      const avgTimePerPage = elapsedTime / scannedPages;
      const remainingPages = this.queue.length;
      const estimatedTimeRemaining = this.formatTime(avgTimePerPage * remainingPages);

      this.onProgress({
        scannedPages,
        totalPages: scannedPages + remainingPages,
        currentUrl,
        estimatedTimeRemaining
      });
    }
  }

  private formatTime(ms: number): string {
    if (ms < 60000) {
      return `${Math.round(ms / 1000)} Sekunden`;
    }
    return `${Math.round(ms / 60000)} Minuten`;
  }
}
