
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteScanResult, DiscoveredPage, ScanProgress } from '@/services/types/scanner.types';
import { toast } from 'sonner';
import { FormParser } from './parsers/formParser';
import { LinkParser } from './parsers/linkParser';
import { SitemapParser } from './parsers/sitemapParser';

export class WebsiteScanner {
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
      const sitemapUrls = await this.scanSitemap();
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

        // Aktualisiere den Fortschritt
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

        const page = await this.crawlPage(currentUrl);
        if (page) {
          discoveredPages.push(page);

          // Füge neue URLs zur Queue hinzu
          if (!this.options.singleUrlOnly) {
            const newUrls = await this.extractLinks(page);
            for (const url of newUrls) {
              if (!this.visitedUrls.has(url) && !this.queue.includes(url)) {
                this.queue.push(url);
              }
            }
          }
        }
      }

      return discoveredPages;
    } catch (error) {
      console.error('Error scanning website:', error);
      return [];
    }
  }

  private async scanSitemap(): Promise<string[]> {
    try {
      const sitemapUrls = await SitemapParser.parse(this.url);
      return sitemapUrls.filter(url => this.isValidUrl(url));
    } catch (error) {
      console.warn('Error parsing sitemap:', error);
      return [];
    }
  }

  private async crawlPage(url: string): Promise<DiscoveredPage | null> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse Formulare auf der Seite
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

  private formatTime(ms: number): string {
    if (ms < 60000) {
      return `${Math.round(ms / 1000)} Sekunden`;
    }
    return `${Math.round(ms / 60000)} Minuten`;
  }
}

export const useWebsiteScanner = (websiteUrl?: string) => {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);

  // Fetch existing scan results
  const { data: scanResult, isLoading: isLoadingResults } = useQuery({
    queryKey: ['website-scan', websiteUrl],
    queryFn: async () => {
      if (!websiteUrl) return null;
      
      const { data: website, error: websiteError } = await supabase
        .from('websites')
        .select('*, discovered_pages(*)')
        .eq('url', websiteUrl)
        .single();

      if (websiteError) throw websiteError;
      
      // Transform the data to match WebsiteScanResult
      const result: WebsiteScanResult = {
        id: website.id,
        url: website.url,
        lastScanAt: website.last_scan_at,
        pages: website.discovered_pages.map((page: any) => ({
          id: page.id,
          url: page.url,
          title: page.title,
          forms: [],
          lastSeenAt: new Date(page.last_seen_at)
        }))
      };

      return result;
    },
    enabled: !!websiteUrl
  });

  // Start new website scan
  const { mutate: startScan } = useMutation({
    mutationFn: async (url: string) => {
      setScanning(true);
      try {
        // Insert or update website record
        const { data: website, error: websiteError } = await supabase
          .from('websites')
          .upsert({ 
            url, 
            last_scan_at: new Date().toISOString() 
          })
          .select()
          .single();

        if (websiteError) throw websiteError;

        const pages: DiscoveredPage[] = await scanWebsite(url);
        
        // Save discovered pages
        for (const page of pages) {
          const { error: pageError } = await supabase
            .from('discovered_pages')
            .upsert({
              website_id: website.id,
              url: page.url,
              title: page.title,
              last_seen_at: new Date().toISOString()
            });

          if (pageError) throw pageError;
        }

        return { ...website, pages };
      } finally {
        setScanning(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-scan'] });
      toast.success('Website-Scan erfolgreich abgeschlossen');
    },
    onError: (error) => {
      console.error('Scan error:', error);
      toast.error('Fehler beim Website-Scan');
    }
  });

  return {
    scanResult,
    isLoadingResults,
    scanning,
    startScan
  };
};

// Korrigiere die Zeile 165, füge den fehlenden Parameter hinzu
const scanWebsite = async (url: string, options = {}): Promise<DiscoveredPage[]> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    return [{
      url,
      title: html.match(/<title>(.*?)<\/title>/)?.[1] || url,
      forms: [],
      lastSeenAt: new Date()
    }];
  } catch (error) {
    console.error('Error scanning website:', error);
    return [];
  }
};
