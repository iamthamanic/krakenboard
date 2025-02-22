
import { supabase } from '@/integrations/supabase/client';
import { Integration, ApiMetric } from './types';

export abstract class BaseIntegrationService {
  protected integration: Integration;

  constructor(integration: Integration) {
    this.integration = integration;
  }

  abstract sync(): Promise<void>;
  abstract validateCredentials(): Promise<boolean>;
  
  protected async saveMetric(metric: Omit<ApiMetric, 'id' | 'created_at' | 'updated_at'>) {
    const { error } = await supabase
      .from('api_metrics')
      .insert({
        integration_id: this.integration.id,
        ...metric
      });

    if (error) {
      console.error('Error saving metric:', error);
      throw error;
    }
  }

  protected async updateIntegrationStatus(status: Integration['status']) {
    const { error } = await supabase
      .from('integrations')
      .update({ 
        status,
        last_sync_at: status === 'active' ? new Date().toISOString() : null
      })
      .eq('id', this.integration.id);

    if (error) {
      console.error('Error updating integration status:', error);
      throw error;
    }
  }
}
