
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MessageCircle, Share2, BarChart, Activity } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

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

        {/* TODO: Social Media Performance Charts & Tabellen */}
      </div>
    </DashboardLayout>
  );
};

export default SocialOrganicPage;
