
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          throw new Error('Kein Authorization Code gefunden');
        }

        // Handle different OAuth flows based on state parameter
        if (state?.startsWith('google_')) {
          await GoogleAnalyticsService.handleCallback(code, state);
          toast.success(state === 'google_analytics' 
            ? "Google Analytics wurde erfolgreich verbunden"
            : "Google Tag Manager wurde erfolgreich verbunden");
        } else if (state?.includes('facebook') || state?.includes('meta')) {
          const { error } = await supabase.functions.invoke('meta-auth-callback', {
            body: { code, redirect_uri: window.location.origin + '/oauth/callback' }
          });
          if (error) throw error;
          toast.success("Meta Business wurde erfolgreich verbunden");
        } else if (state?.includes('linkedin')) {
          const { error } = await supabase.functions.invoke('linkedin-auth-callback', {
            body: { code, redirect_uri: window.location.origin + '/oauth/callback' }
          });
          if (error) throw error;
          toast.success("LinkedIn wurde erfolgreich verbunden");
        }
        
        navigate('/integrations');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error("Fehler bei der OAuth Verbindung");
        navigate('/integrations');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isProcessing && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Verbindung wird hergestellt...</p>
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;
