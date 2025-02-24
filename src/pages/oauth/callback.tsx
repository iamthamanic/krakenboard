
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";
import { GA4PropertySelector } from "@/components/integrations/GA4PropertySelector";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GA4Property {
  propertyId: string;
  propertyName: string;
}

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [properties, setProperties] = useState<GA4Property[]>([]);
  const [websiteId, setWebsiteId] = useState<string>("");

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
          const data = await GoogleAnalyticsService.handleCallback(code, state);
          
          if (state === 'google_analytics') {
            // Simulierte Properties für Test-Zwecke
            // TODO: Echte Properties über die GA4 API abrufen
            setProperties([
              { propertyId: "123456", propertyName: "My Website" },
              { propertyId: "789012", propertyName: "My Shop" }
            ]);
            setWebsiteId("test-website-id"); // TODO: Echte Website-ID verwenden
            setShowPropertySelector(true);
            setIsProcessing(false);
            return;
          }
          
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
        if (!showPropertySelector) {
          setIsProcessing(false);
        }
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  const handlePropertySelect = async (selectedProperties: GA4Property[]) => {
    toast.success(`${selectedProperties.length} Properties ausgewählt`);
    navigate('/integrations');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isProcessing && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Verbindung wird hergestellt...</p>
        </div>
      )}
      
      <GA4PropertySelector
        websiteId={websiteId}
        properties={properties}
        open={showPropertySelector}
        onOpenChange={(open) => {
          if (!open) {
            navigate('/integrations');
          }
          setShowPropertySelector(open);
        }}
        onPropertySelect={handlePropertySelect}
      />
    </div>
  );
};

export default OAuthCallback;
