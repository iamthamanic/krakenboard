
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
      return website as WebsiteScanResult;
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
          .upsert({ url, last_scan_at: new Date() })
          .select()
          .single();

        if (websiteError) throw websiteError;

        // Start the scanning process
        // Note: This would typically be handled by a background worker
        // For now we'll do it in the browser
        const pages: DiscoveredPage[] = await scanWebsite(url);
        
        // Save discovered pages
        for (const page of pages) {
          const { error: pageError } = await supabase
            .from('discovered_pages')
            .upsert({
              website_id: website.id,
              url: page.url,
              title: page.title,
              last_seen_at: new Date()
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

// Helper function to scan website (simplified version)
const scanWebsite = async (url: string): Promise<DiscoveredPage[]> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // This is a simplified version - in production we would:
    // 1. Use a proper HTML parser
    // 2. Follow links recursively
    // 3. Handle different types of forms
    // 4. Handle JavaScript-rendered content
    // 5. Respect robots.txt
    
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
