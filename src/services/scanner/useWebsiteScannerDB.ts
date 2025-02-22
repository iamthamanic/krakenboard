
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteScanResult, DiscoveredPage } from '../types/scanner.types';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export const useWebsiteScannerDB = (websiteUrl?: string) => {
  const queryClient = useQueryClient();

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

  const { mutate: saveScanResults } = useMutation({
    mutationFn: async ({ url, pages }: { url: string; pages: DiscoveredPage[] }) => {
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

      // Save discovered pages and forms
      for (const page of pages) {
        // Insert/update page
        const { data: savedPage, error: pageError } = await supabase
          .from('discovered_pages')
          .upsert({
            website_id: website.id,
            url: page.url,
            title: page.title,
            last_seen_at: new Date().toISOString()
          })
          .select()
          .single();

        if (pageError) throw pageError;

        // Insert/update forms
        for (const form of page.forms) {
          const formData: Database['public']['Tables']['forms']['Insert'] = {
            form_type: form.type,
            fields_count: form.fields,
            is_multi_step: form.isMultiStep,
            steps_count: form.stepsCount || 1,
            success_page: form.successPage || null,
            action: form.action || null,
            method: form.method || null,
            submit_button: form.submitButton ? JSON.parse(JSON.stringify(form.submitButton)) : {},
            form_inputs: form.inputs ? JSON.parse(JSON.stringify(form.inputs)) : [],
            page_id: savedPage.id
          };

          const { error: formError } = await supabase
            .from('forms')
            .upsert(formData);

          if (formError) {
            console.error('Error saving form:', formError);
            throw formError;
          }
        }
      }

      return { ...website, pages };
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
    saveScanResults
  };
};
