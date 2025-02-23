
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const GA4_METRICS_KEY = 'ga4-metrics';

export const useGA4Metrics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [GA4_METRICS_KEY, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('ga4_metrics')
        .select('*')
        .order('date_hour', { ascending: false });

      if (startDate) {
        query = query.gte('date_hour', startDate);
      }
      
      if (endDate) {
        query = query.lte('date_hour', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 Minuten Cache
  });
};
