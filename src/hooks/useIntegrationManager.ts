
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Integration, IntegrationType } from '@/services/integrations/types';
import { GoogleAnalyticsService } from '@/services/integrations/GoogleAnalyticsService';
import { toast } from '@/components/ui/use-toast';

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
          type: params.type,
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
      toast({
        title: "Erfolg",
        description: "Integration erfolgreich erstellt"
      });
    },
    onError: (error) => {
      console.error('Error creating integration:', error);
      toast({
        title: "Fehler",
        description: "Fehler beim Erstellen der Integration",
        variant: "destructive"
      });
    }
  });

  const syncIntegration = useMutation({
    mutationFn: async (integration: Integration) => {
      let service;
      
      switch (integration.type) {
        case 'google_analytics':
          service = new GoogleAnalyticsService(integration.credentials.propertyId, integration.credentials.accessToken);
          break;
        // Weitere Dienste hier hinzufügen
        default:
          throw new Error(`Unbekannter Integrationstyp: ${integration.type}`);
      }

      const isValid = await service.validateCredentials();
      if (!isValid) {
        throw new Error('Ungültige Credentials');
      }

      await service.sync();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Erfolg",
        description: "Daten erfolgreich synchronisiert"
      });
    },
    onError: (error) => {
      console.error('Sync error:', error);
      toast({
        title: "Fehler",
        description: "Fehler bei der Datensynchronisation",
        variant: "destructive"
      });
    }
  });

  return {
    integrations,
    isLoading,
    createIntegration,
    syncIntegration
  };
};
