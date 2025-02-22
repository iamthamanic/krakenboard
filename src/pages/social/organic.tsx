
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { MessageCircle, Share2, BarChart, Activity } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const mockChartData = [
  { name: "Jan", value: 42000 },
  { name: "Feb", value: 45000 },
  { name: "Mar", value: 48000 },
  { name: "Apr", value: 52300 },
  { name: "Mai", value: 55000 },
  { name: "Jun", value: 58000 }
];

const mockEngagementData = [
  { name: "Jan", value: 7200 },
  { name: "Feb", value: 7800 },
  { name: "Mar", value: 8100 },
  { name: "Apr", value: 8900 },
  { name: "Mai", value: 9200 },
  { name: "Jun", value: 9500 }
];

const SocialOrganicPage = () => {
  const t = translations[getStoredLanguage()];
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Performance</h1>
          <p className="text-muted-foreground">
            Analyse der organischen Social Media Performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Organic Reach"
            value="52.3K"
            icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzte Woche"
          />
          <StatsCard
            title="Engagement"
            value="8.9K"
            icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 5, isPositive: true }}
            description="vs. letzte Woche"
          />
          <StatsCard
            title="Klickrate"
            value="2.4%"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.5, isPositive: true }}
            description="vs. letzte Woche"
          />
          <StatsCard
            title="ROI"
            value="324%"
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. letztes Quartal"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PerformanceChart
            title="Organische Reichweite"
            data={mockChartData}
          />
          <PerformanceChart
            title="Engagement Entwicklung"
            data={mockEngagementData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialOrganicPage;
