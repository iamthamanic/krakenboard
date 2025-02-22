
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CreditCard, Activity, Share2, BarChart } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

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

        {/* TODO: Paid Social Performance Charts & Tabellen */}
      </div>
    </DashboardLayout>
  );
};

export default SocialPaidPage;
