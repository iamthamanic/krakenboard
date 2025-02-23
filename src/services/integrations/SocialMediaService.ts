import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface ApiMetricRow {
  created_at: string;
  id: string;
  integration_id: string;
  metric_name: string;
  metric_type: string;
  timestamp: string;
  updated_at: string;
  value: Json;
}

export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagement_rate: number;
  reach: number;
  interactions: number;
  timestamp: string;
}

export class SocialMediaService {
  static async initiateFacebookAuth() {
    try {
      const { data, error } = await supabase.functions.invoke('meta-auth', {
        body: { 
          redirect_uri: window.location.origin + '/oauth/callback',
          scope: 'pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights'
        }
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating Facebook auth:', error);
      throw error;
    }
  }

  static async initiateInstagramAuth() {
    try {
      const { data, error } = await supabase.functions.invoke('instagram-auth', {
        body: { 
          redirect_uri: window.location.origin + '/oauth/callback',
          scope: 'instagram_basic,instagram_manage_insights'
        }
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating Instagram auth:', error);
      throw error;
    }
  }

  static async initiateLinkedInAuth() {
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-auth', {
        body: { 
          redirect_uri: window.location.origin + '/oauth/callback',
          scope: 'r_organization_social,r_ads,rw_ads'
        }
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating LinkedIn auth:', error);
      throw error;
    }
  }

  static async initiateYouTubeAuth() {
    throw new Error("YouTube OAuth wird implementiert");
  }

  static async initiateTikTokAuth() {
    throw new Error("TikTok OAuth wird implementiert");
  }

  static async initiateGoogleAdsAuth() {
    throw new Error("Google Ads OAuth wird implementiert");
  }

  static async initiateMetaAdsAuth() {
    throw new Error("Meta Ads OAuth wird implementiert");
  }

  static async initiateLinkedInAdsAuth() {
    throw new Error("LinkedIn Ads OAuth wird implementiert");
  }

  static async initiateTikTokAdsAuth() {
    throw new Error("TikTok Ads OAuth wird implementiert");
  }

  private static transformMetrics(rows: ApiMetricRow[]): SocialMediaMetrics[] {
    return rows.map(row => ({
      platform: row.metric_type,
      followers: typeof row.value === 'object' && row.value !== null ? (row.value as { followers?: number })?.followers || 0 : 0,
      engagement_rate: typeof row.value === 'object' && row.value !== null ? (row.value as { engagement_rate?: number })?.engagement_rate || 0 : 0,
      reach: typeof row.value === 'object' && row.value !== null ? (row.value as { reach?: number })?.reach || 0 : 0,
      interactions: typeof row.value === 'object' && row.value !== null ? (row.value as { interactions?: number })?.interactions || 0 : 0,
      timestamp: row.timestamp
    }));
  }

  static async getMetrics(platform: string): Promise<SocialMediaMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .eq('metric_type', platform)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (error) throw error;
      
      return this.transformMetrics(data as ApiMetricRow[]);
    } catch (error) {
      console.error(`Error fetching ${platform} metrics:`, error);
      throw error;
    }
  }
}
