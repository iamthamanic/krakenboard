
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SocialMediaStats } from "@/components/dashboard/SocialMediaStats";
import { 
  Activity, 
  Users, 
  Globe, 
  FormInput, 
  BarChart, 
  Share2, 
  MessageCircle, 
  CreditCard,
  Chrome,
  Facebook,
  Youtube,
  TrendingUp
} from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const t = translations[getStoredLanguage()];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.overview}</h1>
          <p className="text-muted-foreground">{t.kpiDescription}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.websitePerformance}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t.websiteVisitors}
                value="24.7K"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 12, isPositive: true }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.pageViews}
                value="123.4K"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 8, isPositive: true }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.activeForms}
                value="18"
                icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
                description={t.onAllPages}
              />
              <StatsCard
                title={t.discoveredPages}
                value="42"
                icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                description={t.autoDetected}
              />
            </div>
          </div>

          <SocialMediaStats />

          <div>
            <h2 className="text-xl font-semibold mb-4">{t.googleAds}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t.clicks}
                value="12.4K"
                icon={<Chrome className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 18, isPositive: true }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.impressions}
                value="89.2K"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 9, isPositive: true }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title="Cost per Click"
                value="€0.32"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 4, isPositive: false }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.conversionRate}
                value="2.8%"
                icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 7, isPositive: true }}
                description={t.vsLastMonth}
              />
            </div>
          </div>
        </div>

        <div>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Aktive Integrationen</CardTitle>
              <CardDescription>
                Überblick über alle verbundenen Datenquellen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex items-center space-x-2 p-2 rounded-lg border">
                  <Chrome className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Google Analytics</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg border">
                  <Facebook className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Meta Business</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg border">
                  <Youtube className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">YouTube Studio</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg border">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Google Ads</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
