
import { supabase } from "@/integrations/supabase/client";

export class GoogleAnalyticsService {
  static async initiateOAuth() {
    try {
      const { data: config } = await supabase
        .from('oauth_config')
        .select('google_client_id')
        .single();

      if (!config?.google_client_id) {
        throw new Error('Google Client ID nicht konfiguriert');
      }

      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = encodeURIComponent('https://www.googleapis.com/auth/analytics.readonly');
      const state = 'google_analytics';
      
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google_client_id}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&state=${state}`;
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
      const state = 'google_tag_manager';
      
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google_client_id}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&state=${state}`;
    } catch (error) {
      console.error('Error initiating GTM OAuth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, type: string = 'google_analytics') {
    try {
      // Exchange auth code for tokens
      const { data, error } = await supabase.functions.invoke('google-auth-callback', {
        body: { code, type }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }
}

export class CloudflareAnalyticsService {
  static cloudflareTokenDialog: {
    open: (onOpenChange: (open: boolean) => void) => void;
    setOpen: (open: boolean) => void;
  } | null = null;

  static registerTokenDialog(dialogControls: {
    open: (onOpenChange: (open: boolean) => void) => void;
    setOpen: (open: boolean) => void;
  }) {
    this.cloudflareTokenDialog = dialogControls;
  }

  static async initiateOAuth() {
    if (this.cloudflareTokenDialog) {
      this.cloudflareTokenDialog.setOpen(true);
    } else {
      console.error('Cloudflare token dialog not registered');
    }
  }
}
