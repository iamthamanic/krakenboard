
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Chrome,
  Facebook,
  Linkedin,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
}

const IntegrationCard = ({ title, description, icon, isConnected }: IntegrationCardProps) => (
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
      >
        {isConnected ? "Verbunden" : "Verbinden"}
      </Button>
    </div>
  </Card>
);

const Integrations = () => {
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

        <div className="grid gap-6">
          <IntegrationCard
            title="Google Analytics & Ads"
            description="Tracking, Kampagnen und Performance-Daten"
            icon={<Chrome className="h-5 w-5" />}
            isConnected={false}
          />
          <IntegrationCard
            title="Facebook & Instagram"
            description="Social Media Performance und Werbeanalysen"
            icon={<Facebook className="h-5 w-5" />}
            isConnected={false}
          />
          <IntegrationCard
            title="LinkedIn"
            description="B2B Marketing und Kampagnen-Tracking"
            icon={<Linkedin className="h-5 w-5" />}
            isConnected={false}
          />
          <IntegrationCard
            title="TikTok"
            description="Social Media Reichweite und Ad Performance"
            icon={<MessageCircle className="h-5 w-5" />}
            isConnected={false}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
