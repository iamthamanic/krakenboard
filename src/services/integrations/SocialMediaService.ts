
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke('facebook-auth', {
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

  static async getMetrics(platform: string): Promise<SocialMediaMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('api_metrics')
        .select('*')
        .eq('integration_type', platform)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as SocialMediaMetrics[];
    } catch (error) {
      console.error(`Error fetching ${platform} metrics:`, error);
      throw error;
    }
  }
}
