import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Chrome,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  AlertCircle,
  Youtube,
  CreditCard,
  BarChart3,
  BarChart4,
  Activity,
  CloudCog
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIntegrations } from "@/hooks/useIntegrations";
import { toast } from "@/components/ui/use-toast";
import { GoogleAnalyticsService, CloudflareAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";
import { SocialMediaService } from "@/services/integrations/SocialMediaService";
import { CloudflareTokenDialog } from "@/components/integrations/CloudflareTokenDialog";
import { useState, useEffect } from "react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  onConnect: () => void;
  type: string;
}

const IntegrationCard = ({ title, description, icon, isConnected, onConnect }: IntegrationCardProps) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-secondary-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button
        variant={isConnected ? "outline" : "default"}
        className={isConnected ? "border-green-500 text-green-500 hover:bg-green-50" : ""}
        onClick={onConnect}
      >
        {isConnected ? "Verbunden" : "Verbinden"}
      </Button>
    </div>
  </Card>
);

const Integrations = () => {
  const { data: integrations, isLoading } = useIntegrations();
  const [isCloudflareDialogOpen, setIsCloudflareDialogOpen] = useState(false);

  useEffect(() => {
    CloudflareAnalyticsService.registerTokenDialog({
      open: (onOpenChange) => setIsCloudflareDialogOpen(true),
      setOpen: setIsCloudflareDialogOpen,
    });
  }, []);

  const handleConnect = async (type: string) => {
    try {
      switch(type) {
        case 'google_analytics':
          const authUrl = await GoogleAnalyticsService.initiateOAuth();
          window.location.href = authUrl;
          break;
        case 'google_tag_manager':
          const gtmAuthUrl = await GoogleAnalyticsService.initiateTagManagerOAuth();
          window.location.href = gtmAuthUrl;
          break;
        case 'cloudflare':
          await CloudflareAnalyticsService.initiateOAuth();
          break;
        case 'facebook':
          await SocialMediaService.initiateFacebookAuth();
          break;
        case 'instagram':
          await SocialMediaService.initiateInstagramAuth();
          break;
        case 'linkedin':
          await SocialMediaService.initiateLinkedInAuth();
          break;
        case 'youtube':
          await SocialMediaService.initiateYouTubeAuth();
          break;
        case 'tiktok':
          await SocialMediaService.initiateTikTokAuth();
          break;
        case 'google_ads':
          await SocialMediaService.initiateGoogleAdsAuth();
          break;
        case 'meta_ads':
          await SocialMediaService.initiateMetaAdsAuth();
          break;
        case 'linkedin_ads':
          await SocialMediaService.initiateLinkedInAdsAuth();
          break;
        case 'tiktok_ads':
          await SocialMediaService.initiateTikTokAdsAuth();
          break;
        default:
          toast({
            title: "Info",
            description: "OAuth2-Integration wird implementiert...",
          });
      }
    } catch (error) {
      console.error('Error connecting:', error);
      toast({
        title: "Fehler",
        description: "Fehler bei der Verbindung zur Integration",
        variant: "destructive"
      });
    }
  };

  const isIntegrationActive = (type: string) => {
    return integrations?.some(integration => 
      integration.type === type && integration.is_active
    ) ?? false;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrationen</h1>
          <p className="text-muted-foreground">
            Verbinde deine Datenquellen mit KrakenBoard
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Verbinde deine Analytics-Tools, um Echtzeitdaten in deinem Dashboard zu sehen.
          </AlertDescription>
        </Alert>

        <div>
          <h2 className="text-xl font-semibold mb-4">Analytics & Tracking</h2>
          <div className="grid gap-6">
            <IntegrationCard
              title="Google Analytics 4"
              description="Verbinde GA4 für ungesampelte Rohdaten"
              icon={<BarChart4 className="h-5 w-5" />}
              isConnected={isIntegrationActive('google_analytics')}
              onConnect={() => handleConnect('google_analytics')}
              type="google_analytics"
            />
            <IntegrationCard
              title="Google Tag Manager"
              description="Event-Tracking & Custom-Dimensionen"
              icon={<Activity className="h-5 w-5" />}
              isConnected={isIntegrationActive('google_tag_manager')}
              onConnect={() => handleConnect('google_tag_manager')}
              type="google_tag_manager"
            />
            <IntegrationCard
              title="Cloudflare Analytics"
              description="Server-Side Analytics ohne Cookies"
              icon={<CloudCog className="h-5 w-5" />}
              isConnected={isIntegrationActive('cloudflare')}
              onConnect={() => handleConnect('cloudflare')}
              type="cloudflare"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Organische Reichweite</h2>
          <div className="grid gap-6">
            <IntegrationCard
              title="Meta Business Suite"
              description="Facebook & Instagram Organic Performance"
              icon={<Facebook className="h-5 w-5" />}
              isConnected={isIntegrationActive('facebook')}
              onConnect={() => handleConnect('facebook')}
              type="facebook"
            />
            <IntegrationCard
              title="Instagram Professional"
              description="Instagram Insights & Performance"
              icon={<Instagram className="h-5 w-5" />}
              isConnected={isIntegrationActive('instagram')}
              onConnect={() => handleConnect('instagram')}
              type="instagram"
            />
            <IntegrationCard
              title="LinkedIn Company Page"
              description="Organic Posts & Engagement"
              icon={<Linkedin className="h-5 w-5" />}
              isConnected={isIntegrationActive('linkedin')}
              onConnect={() => handleConnect('linkedin')}
              type="linkedin"
            />
            <IntegrationCard
              title="YouTube Studio"
              description="Video Performance & Analytics"
              icon={<Youtube className="h-5 w-5" />}
              isConnected={isIntegrationActive('youtube')}
              onConnect={() => handleConnect('youtube')}
              type="youtube"
            />
            <IntegrationCard
              title="TikTok Business Center"
              description="Organische TikTok Performance"
              icon={<MessageCircle className="h-5 w-5" />}
              isConnected={isIntegrationActive('tiktok')}
              onConnect={() => handleConnect('tiktok')}
              type="tiktok"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Werbekonten</h2>
          <div className="grid gap-6">
            <IntegrationCard
              title="Google Ads"
              description="Performance Marketing & Search Ads"
              icon={<CreditCard className="h-5 w-5" />}
              isConnected={isIntegrationActive('google_ads')}
              onConnect={() => handleConnect('google_ads')}
              type="google_ads"
            />
            <IntegrationCard
              title="Meta Ads Manager"
              description="Facebook & Instagram Ads"
              icon={<BarChart3 className="h-5 w-5" />}
              isConnected={isIntegrationActive('meta_ads')}
              onConnect={() => handleConnect('meta_ads')}
              type="meta_ads"
            />
            <IntegrationCard
              title="LinkedIn Ads"
              description="B2B Marketing & Sponsored Content"
              icon={<Linkedin className="h-5 w-5" />}
              isConnected={isIntegrationActive('linkedin_ads')}
              onConnect={() => handleConnect('linkedin_ads')}
              type="linkedin_ads"
            />
            <IntegrationCard
              title="TikTok Ads Manager"
              description="TikTok Werbekampagnen & Analytics"
              icon={<MessageCircle className="h-5 w-5" />}
              isConnected={isIntegrationActive('tiktok_ads')}
              onConnect={() => handleConnect('tiktok_ads')}
              type="tiktok_ads"
            />
          </div>
        </div>

        <CloudflareTokenDialog 
          open={isCloudflareDialogOpen} 
          onOpenChange={setIsCloudflareDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
