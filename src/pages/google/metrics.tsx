
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart, Share2, CreditCard, Activity } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

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

        {/* TODO: Detaillierte Performance Metriken & Visualisierungen */}
      </div>
    </DashboardLayout>
  );
};

export default GoogleMetricsPage;
