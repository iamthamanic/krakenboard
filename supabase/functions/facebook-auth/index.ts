
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const FACEBOOK_APP_ID = Deno.env.get('FACEBOOK_APP_ID')
const FACEBOOK_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET')

serve(async (req) => {
  try {
    const { redirect_uri, scope } = await req.json()
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=code`

    return new Response(
      JSON.stringify({ authUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
