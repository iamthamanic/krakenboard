
export type IntegrationType = 
  | 'google_analytics'
  | 'google_ads'
  | 'facebook_ads'
  | 'facebook_pages'
  | 'instagram_business'
  | 'linkedin_ads'
  | 'linkedin_pages'
  | 'tiktok_ads'
  | 'tiktok_business'
  | 'youtube_analytics'
  | 'shopify'
  | 'woocommerce'
  | 'stripe';

export type IntegrationStatus = 'pending' | 'active' | 'error' | 'disabled';

export interface Integration {
  id: string;
  integration_type: IntegrationType;
  status: IntegrationStatus;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiMetric {
  id: string;
  integration_id: string;
  metric_type: string;
  metric_name: string;
  value: any;
  timestamp: string;
  created_at: string;
  updated_at: string;
}
