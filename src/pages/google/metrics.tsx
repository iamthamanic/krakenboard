
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { BarChart, Share2, CreditCard, Activity } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const mockConversionData = [
  { name: "Jan", value: 2.4 },
  { name: "Feb", value: 2.5 },
  { name: "Mar", value: 2.6 },
  { name: "Apr", value: 2.8 },
  { name: "Mai", value: 2.9 },
  { name: "Jun", value: 3.0 }
];

const mockQualityScoreData = [
  { name: "Jan", value: 7.2 },
  { name: "Feb", value: 7.4 },
  { name: "Mar", value: 7.6 },
  { name: "Apr", value: 8.0 },
  { name: "Mai", value: 8.2 },
  { name: "Jun", value: 8.4 }
];

const GoogleMetricsPage = () => {
  const t = translations[getStoredLanguage()];
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Metriken</h1>
          <p className="text-muted-foreground">
            Detaillierte Google Ads Performance Metriken
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Conversion Rate"
            value="2.8%"
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.4, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="CPC"
            value="€0.45"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.05, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Quality Score"
            value="8/10"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 1, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="ROAS"
            value="3.2x"
            icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.3, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PerformanceChart
            title="Conversion Rate Trend"
            data={mockConversionData}
          />
          <PerformanceChart
            title="Quality Score Entwicklung"
            data={mockQualityScoreData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleMetricsPage;
