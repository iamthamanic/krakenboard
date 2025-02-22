
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CreditCard, Activity, Share2, BarChart } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const mockCampaignData = [
  {
    campaign: "Summer Sale 2024",
    impressions: "45.2K",
    clicks: "2.3K",
    ctr: "5.1%",
    spend: "€534",
    roas: "2.8x"
  },
  {
    campaign: "Product Launch",
    impressions: "89.1K",
    clicks: "4.8K",
    ctr: "5.4%",
    spend: "€890",
    roas: "3.2x"
  },
  {
    campaign: "Brand Awareness",
    impressions: "102.3K",
    clicks: "5.1K",
    ctr: "5.0%",
    spend: "€780",
    roas: "2.5x"
  }
];

const campaignColumns = [
  { key: "campaign", label: "Kampagne" },
  { key: "impressions", label: "Impressionen" },
  { key: "clicks", label: "Klicks" },
  { key: "ctr", label: "CTR" },
  { key: "spend", label: "Ausgaben" },
  { key: "roas", label: "ROAS" }
];

const mockPerformanceData = [
  { name: "Jan", value: 180000 },
  { name: "Feb", value: 195000 },
  { name: "Mar", value: 205000 },
  { name: "Apr", value: 234100 },
  { name: "Mai", value: 245000 },
  { name: "Jun", value: 258000 }
];

const SocialPaidPage = () => {
  const t = translations[getStoredLanguage()];
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paid Social Performance</h1>
          <p className="text-muted-foreground">
            Analyse der bezahlten Social Media Kampagnen
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ad Impressionen"
            value="234.1K"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 23, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Klickrate"
            value="1.8%"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.3, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Engagement Rate"
            value="3.2%"
            icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.8, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="ROAS"
            value="2.8x"
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.4, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Performance Übersicht</h2>
          <PerformanceChart
            title="Ad Impressionen Trend"
            data={mockPerformanceData}
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

export default SocialPaidPage;
