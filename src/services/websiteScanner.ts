import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteScanResult, DiscoveredPage } from '@/services/types/scanner.types';
import { toast } from 'sonner';

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
