
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Activity, Users, Globe, FormInput, BarChart, Share2, MessageCircle, CreditCard } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gesamtübersicht</h1>
          <p className="text-muted-foreground">Alle wichtigen KPIs auf einen Blick.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Website Performance</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Website Besucher"
                value="24.7K"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 12, isPositive: true }}
                description="vs. letzter Monat"
              />
              <StatsCard
                title="Seitenaufrufe"
                value="123.4K"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 8, isPositive: true }}
                description="vs. letzter Monat"
              />
              <StatsCard
                title="Aktive Formulare"
                value="18"
                icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
                description="Auf allen Seiten"
              />
              <StatsCard
                title="Erfasste Seiten"
                value="42"
                icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                description="Automatisch erkannt"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Social Media Performance</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Organic Reach"
                value="52.3K"
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 15, isPositive: true }}
                description="vs. letzte Woche"
              />
              <StatsCard
                title="Social Engagement"
                value="8.9K"
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 5, isPositive: true }}
                description="vs. letzte Woche"
              />
              <StatsCard
                title="Ad Impressionen"
                value="234.1K"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 23, isPositive: true }}
                description="vs. letzter Monat"
              />
              <StatsCard
                title="Social ROI"
                value="324%"
                icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 12, isPositive: true }}
                description="vs. letztes Quartal"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Google Ads Performance</h2>
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
                title="CTR"
                value="3.2%"
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 4, isPositive: false }}
                description="vs. letzter Monat"
              />
              <StatsCard
                title="Conversion Rate"
                value="2.8%"
                icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 7, isPositive: true }}
                description="vs. letzter Monat"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
