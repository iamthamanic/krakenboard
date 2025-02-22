
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { BarChart, Activity, CreditCard, Share2 } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const mockCampaignData = [
  {
    campaign: "Brand Search",
    impressions: "125.3K",
    clicks: "8.2K",
    ctr: "6.5%",
    cost: "€980",
    conversions: "145"
  },
  {
    campaign: "Product Keywords",
    impressions: "234.8K",
    clicks: "12.4K",
    ctr: "5.3%",
    cost: "€1,540",
    conversions: "89"
  },
  {
    campaign: "Competitor Terms",
    impressions: "89.2K",
    clicks: "4.1K",
    ctr: "4.6%",
    cost: "€780",
    conversions: "52"
  }
];

const campaignColumns = [
  { key: "campaign", label: "Kampagne" },
  { key: "impressions", label: "Impressionen" },
  { key: "clicks", label: "Klicks" },
  { key: "ctr", label: "CTR" },
  { key: "cost", label: "Kosten" },
  { key: "conversions", label: "Conversions" }
];

const mockClickData = [
  { name: "Jan", value: 10200 },
  { name: "Feb", value: 10800 },
  { name: "Mar", value: 11500 },
  { name: "Apr", value: 12400 },
  { name: "Mai", value: 13100 },
  { name: "Jun", value: 13800 }
];

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

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Klick-Entwicklung</h2>
          <PerformanceChart
            title="Klicks pro Monat"
            data={mockClickData}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Aktive Kampagnen</h2>
          <DataTable 
            columns={campaignColumns}
            data={mockCampaignData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleCampaignsPage;
