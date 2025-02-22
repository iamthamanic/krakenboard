
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Activity, Users, Globe, FormInput, BarChart, Share2, MessageCircle, CreditCard, FileText, Shield } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";
import { Link } from "react-router-dom";

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

          <div>
            <h2 className="text-xl font-semibold mb-4">{t.socialMedia}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t.organicReach}
                value="52.3K"
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 15, isPositive: true }}
                description={t.vsLastWeek}
              />
              <StatsCard
                title={t.socialEngagement}
                value="8.9K"
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 5, isPositive: true }}
                description={t.vsLastWeek}
              />
              <StatsCard
                title={t.adImpressions}
                value="234.1K"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 23, isPositive: true }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.socialROI}
                value="324%"
                icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 12, isPositive: true }}
                description={t.vsLastQuarter}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t.googleAds}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t.clicks}
                value="12.4K"
                icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
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
                title={t.ctr}
                value="3.2%"
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 4, isPositive: false }}
                description={t.vsLastMonth}
              />
              <StatsCard
                title={t.conversionRate}
                value="2.8%"
                icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 7, isPositive: true }}
                description={t.vsLastMonth}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Rechtliches</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/legal/privacy">
                <StatsCard
                  title="Datenschutzerklärung"
                  value="Bearbeiten"
                  icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                  description="Datenschutzrichtlinien verwalten"
                />
              </Link>
              <Link to="/legal/terms">
                <StatsCard
                  title="Nutzungsbedingungen"
                  value="Bearbeiten"
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  description="AGB und Nutzungsbedingungen verwalten"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
