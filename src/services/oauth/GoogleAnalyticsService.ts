
import { supabase } from "@/integrations/supabase/client";

interface OAuthConfig {
  id: string;
  google_client_id: string;
  google_client_secret: string;
  meta_client_id: string;
  meta_client_secret: string;
  created_at: string;
  updated_at: string;
}

export class GoogleAnalyticsService {
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.manage.users.readonly'
  ];

  private static readonly REDIRECT_URI = `${window.location.origin}/oauth/callback`;

  static async initiateOAuth() {
    try {
      const { data: config, error } = await supabase
        .from('oauth_config')
        .select('*')
        .single();

      if (error || !config) {
        throw new Error('OAuth configuration not found');
      }

      const oauthConfig = config as OAuthConfig;

      const params = new URLSearchParams({
        client_id: oauthConfig.google_client_id,
        redirect_uri: this.REDIRECT_URI,
        response_type: 'code',
        scope: this.SCOPES.join(' '),
        access_type: 'offline',
        prompt: 'consent'
      });

      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string) {
    try {
      const { data: config, error } = await supabase
        .from('oauth_config')
        .select('*')
        .single();

      if (error || !config) {
        throw new Error('OAuth configuration not found');
      }

      const oauthConfig = config as OAuthConfig;

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: oauthConfig.google_client_id,
          client_secret: oauthConfig.google_client_secret,
          redirect_uri: this.REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens = await response.json();

      // Speichere die Tokens sicher in Supabase
      await supabase
        .from('integrations')
        .upsert({
          type: 'google_analytics',
          is_active: true,
          metadata: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Date.now() + (tokens.expires_in * 1000)
          }
        });

      return true;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }
}
