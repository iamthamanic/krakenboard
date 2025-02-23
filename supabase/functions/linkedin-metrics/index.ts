
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
      .eq('type', 'linkedin')
      .single();

    if (integrationError) throw integrationError;

    const accessToken = integration.credentials.access_token;

    // Hole Organisation ID
    const orgResponse = await fetch(
      'https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    const orgData = await orgResponse.json();
    
    if (!orgResponse.ok) {
      throw new Error(orgData.message || 'Failed to fetch organization');
    }

    const organizationId = orgData.elements[0]?.organizationalTarget;

    // Hole Follower Statistiken
    const followersResponse = await fetch(
      `https://api.linkedin.com/v2/organizationalEntityFollowerStatistics?` +
      `q=organizationalEntity&organizationalEntity=${organizationId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    const followersData = await followersResponse.json();

    // Hole Page Statistiken
    const pageStatsResponse = await fetch(
      `https://api.linkedin.com/v2/organizationPageStatistics?` +
      `q=organization&organization=${organizationId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    const pageStatsData = await pageStatsResponse.json();

    // Speichere die Metriken in der Datenbank
    const { error: dbError } = await supabase
      .from('api_metrics')
      .insert({
        metric_type: 'linkedin',
        metric_name: 'page_metrics',
        value: {
          followers: followersData.elements[0]?.totalFollowerCount || 0,
          reach: pageStatsData.elements[0]?.views?.totalPageViews?.value || 0,
          interactions: pageStatsData.elements[0]?.engagement?.totalEngagementCount || 0,
          engagement_rate: (pageStatsData.elements[0]?.engagement?.totalEngagementCount / 
            pageStatsData.elements[0]?.views?.totalPageViews?.value * 100) || 0
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
