
import { supabase } from "@/integrations/supabase/client";

export class GoogleAnalyticsService {
  static async initiateOAuth() {
    try {
      // Bestehende GA4 OAuth Implementation
      const { data: config } = await supabase
        .from('oauth_config')
        .select('google_client_id')
        .single();

      if (!config?.google_client_id) {
        throw new Error('Google Client ID nicht konfiguriert');
      }

      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = encodeURIComponent('https://www.googleapis.com/auth/analytics.readonly');
      
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google_client_id}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      throw error;
    }
  }
  
  static async initiateTagManagerOAuth() {
    try {
      const { data: config } = await supabase
        .from('oauth_config')
        .select('google_client_id')
        .single();

      if (!config?.google_client_id) {
        throw new Error('Google Client ID nicht konfiguriert');
      }

      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = encodeURIComponent('https://www.googleapis.com/auth/tagmanager.readonly');
      
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google_client_id}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
    } catch (error) {
      console.error('Error initiating GTM OAuth:', error);
      throw error;
    }
  }
}

export class CloudflareAnalyticsService {
  static async initiateOAuth() {
    try {
      // Cloudflare verwendet API-Token statt OAuth
      // Wir zeigen ein Modal zum Eingeben des API-Tokens
      return '/settings/cloudflare';
    } catch (error) {
      console.error('Error initiating Cloudflare auth:', error);
      throw error;
    }
  }
}
