
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const type = searchParams.get('state') || 'google_analytics';
        
        if (!code) {
          throw new Error('Kein Authorization Code gefunden');
        }

        await GoogleAnalyticsService.handleCallback(code, type);
        
        toast({
          title: "Erfolg",
          description: type === 'google_analytics' 
            ? "Google Analytics wurde erfolgreich verbunden"
            : "Google Tag Manager wurde erfolgreich verbunden",
        });
        
        navigate('/integrations');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Fehler",
          description: "Fehler bei der OAuth Verbindung",
          variant: "destructive"
        });
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
