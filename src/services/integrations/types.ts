
import { Json } from '@/integrations/supabase/types';

export type IntegrationType = 
  | 'google_analytics'
  | 'google_ads'
  | 'meta_ads'
  | 'meta_business'
  | 'linkedin_ads'
  | 'linkedin_company'
  | 'tiktok_ads'
  | 'tiktok_business'
  | 'youtube_studio';

export type IntegrationStatus = 'pending' | 'active' | 'error' | 'disabled';

export interface Integration {
  id: string;
  type: IntegrationType;
  integration_type?: string;
  status: IntegrationStatus;
  credentials: Json;
  settings: Json;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_active?: boolean;
  metadata?: Json;
}

export interface ApiMetric {
  id: string;
  integration_id: string;
  metric_type: string;
  metric_name: string;
  value: Json;
  timestamp: string;
  created_at: string;
  updated_at: string;
}
