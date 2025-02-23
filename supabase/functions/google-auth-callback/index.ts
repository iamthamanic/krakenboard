
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Google Auth Callback Function started");

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, type = 'google_analytics' } = await req.json();
    
    if (!code) {
      throw new Error('Authorization code is required');
    }

    // Hole die OAuth Konfiguration aus der Datenbank
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    );

    const { data: config, error: configError } = await supabaseClient
      .from('oauth_config')
      .select('google_client_id, google_client_secret')
      .single();

    if (configError || !config) {
      throw new Error('Failed to fetch OAuth configuration');
    }

    // Token-Austausch mit Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.google_client_id,
        client_secret: config.google_client_secret,
        redirect_uri: `${req.headers.get('origin')}/oauth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      throw new Error('Token exchange failed');
    }

    // Speichere die Integration mit dem korrekten Typ
    const { error: integrationError } = await supabaseClient
      .from('integrations')
      .insert({
        type: type,
        credentials: tokenData,
        is_active: true,
        metadata: {
          scope: type === 'google_analytics' 
            ? 'https://www.googleapis.com/auth/analytics.readonly'
            : 'https://www.googleapis.com/auth/tagmanager.readonly'
        }
      });

    if (integrationError) {
      throw new Error('Failed to save integration');
    }

    console.log(`Successfully exchanged code for tokens (${type})`);

    return new Response(
      JSON.stringify(tokenData),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Error in google-auth-callback:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
