
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Integration, IntegrationType } from '@/services/integrations/types';
import { GoogleAnalyticsService } from '@/services/integrations/GoogleAnalyticsService';
import { toast } from 'sonner';

export const useIntegrationManager = () => {
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*');

      if (error) throw error;
      return data as Integration[];
    }
  });

  const createIntegration = useMutation({
    mutationFn: async (params: { 
      type: IntegrationType, 
      credentials: Record<string, any>,
      settings?: Record<string, any>
    }) => {
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          integration_type: params.type,
          credentials: params.credentials,
          settings: params.settings || {},
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data as Integration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration erfolgreich erstellt');
    },
    onError: (error) => {
      console.error('Error creating integration:', error);
      toast.error('Fehler beim Erstellen der Integration');
    }
  });

  const syncIntegration = useMutation({
    mutationFn: async (integration: Integration) => {
      let service;
      
      switch (integration.integration_type) {
        case 'google_analytics':
          service = new GoogleAnalyticsService(integration);
          break;
        // Weitere Dienste hier hinzufügen
        default:
          throw new Error(`Unbekannter Integrationstyp: ${integration.integration_type}`);
      }

      const isValid = await service.validateCredentials();
      if (!isValid) {
        throw new Error('Ungültige Credentials');
      }

      await service.sync();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Daten erfolgreich synchronisiert');
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast.error('Fehler bei der Datensynchronisation');
    }
  });

  return {
    integrations,
    isLoading,
    createIntegration,
    syncIntegration
  };
};
