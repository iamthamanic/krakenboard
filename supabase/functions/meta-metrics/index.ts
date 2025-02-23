
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hole den gespeicherten Access Token
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('credentials')
      .eq('type', 'meta')
      .single();

    if (integrationError) throw integrationError;

    const accessToken = integration.credentials.access_token;

    // Hole Facebook Page ID
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();
    
    if (!pagesResponse.ok) {
      throw new Error(pagesData.error?.message || 'Failed to fetch pages');
    }

    const pageId = pagesData.data[0]?.id;
    
    // Hole Metriken für die Facebook Page
    const metricsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/insights?` +
      `metric=page_fans,page_impressions,page_engaged_users&` +
      `period=day&access_token=${accessToken}`
    );
    const metricsData = await metricsResponse.json();

    if (!metricsResponse.ok) {
      throw new Error(metricsData.error?.message || 'Failed to fetch metrics');
    }

    // Speichere die Metriken in der Datenbank
    const { error: dbError } = await supabase
      .from('api_metrics')
      .insert({
        metric_type: 'facebook',
        metric_name: 'page_metrics',
        value: {
          followers: metricsData.data[0]?.values[0]?.value || 0,
          reach: metricsData.data[1]?.values[0]?.value || 0,
          interactions: metricsData.data[2]?.values[0]?.value || 0,
          engagement_rate: metricsData.data[2]?.values[0]?.value / metricsData.data[1]?.values[0]?.value * 100 || 0
        },
        timestamp: new Date().toISOString()
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
