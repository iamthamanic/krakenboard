
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart, Activity, CreditCard, Share2 } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const GoogleCampaignsPage = () => {
  const t = translations[getStoredLanguage()];
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google Ads Kampagnen</h1>
          <p className="text-muted-foreground">
            Übersicht aller aktiven Google Ads Kampagnen
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Klicks"
            value="12.4K"
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 18, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Impressionen"
            value="89.2K"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 9, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Kosten"
            value="€1,234"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 15, isPositive: false }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="CTR"
            value="3.2%"
            icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.5, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>

        {/* TODO: Google Ads Kampagnen Übersicht & Performance Tabellen */}
      </div>
    </DashboardLayout>
  );
};

export default GoogleCampaignsPage;
