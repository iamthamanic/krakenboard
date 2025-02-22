
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Chrome,
  Facebook,
  Linkedin,
  MessageCircle,
  AlertCircle,
  Youtube,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIntegrations } from "@/hooks/useIntegrations";
import { toast } from "@/components/ui/use-toast";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  type: string;
  onConnect: () => void;
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

  const handleConnect = async (type: string) => {
    // Hier später die OAuth2-Authentifizierung implementieren
    toast({
      title: "Info",
      description: "OAuth2-Integration wird implementiert...",
    });
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
            Verbinde deine Accounts, um Echtzeitdaten in deinem Dashboard zu sehen.
          </AlertDescription>
        </Alert>

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

        <div>
          <h2 className="text-xl font-semibold mb-4">Organische Konten</h2>
          <div className="grid gap-6">
            <IntegrationCard
              title="Google Analytics"
              description="Website Traffic & User Behavior"
              icon={<Chrome className="h-5 w-5" />}
              isConnected={isIntegrationActive('google_analytics')}
              onConnect={() => handleConnect('google_analytics')}
              type="google_analytics"
            />
            <IntegrationCard
              title="Meta Business Suite"
              description="Facebook & Instagram Organic Performance"
              icon={<Facebook className="h-5 w-5" />}
              isConnected={isIntegrationActive('meta_business')}
              onConnect={() => handleConnect('meta_business')}
              type="meta_business"
            />
            <IntegrationCard
              title="LinkedIn Company Page"
              description="Organic Posts & Engagement"
              icon={<Linkedin className="h-5 w-5" />}
              isConnected={isIntegrationActive('linkedin_company')}
              onConnect={() => handleConnect('linkedin_company')}
              type="linkedin_company"
            />
            <IntegrationCard
              title="YouTube Studio"
              description="Video Performance & Analytics"
              icon={<Youtube className="h-5 w-5" />}
              isConnected={isIntegrationActive('youtube_studio')}
              onConnect={() => handleConnect('youtube_studio')}
              type="youtube_studio"
            />
            <IntegrationCard
              title="TikTok Business Center"
              description="Organische TikTok Performance"
              icon={<MessageCircle className="h-5 w-5" />}
              isConnected={isIntegrationActive('tiktok_business')}
              onConnect={() => handleConnect('tiktok_business')}
              type="tiktok_business"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
