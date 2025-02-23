
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('Kein Authorization Code gefunden');
        }

        await GoogleAnalyticsService.handleCallback(code);
        
        toast({
          title: "Erfolg",
          description: "Google Analytics wurde erfolgreich verbunden",
        });
        
        navigate('/integrations');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Fehler",
          description: "Fehler bei der Verbindung mit Google Analytics",
          variant: "destructive"
        });
        navigate('/integrations');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

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
