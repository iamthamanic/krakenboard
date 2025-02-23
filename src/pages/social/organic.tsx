
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, MessageCircle, Share2 } from "lucide-react";
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";

const SocialOrganic = () => {
  const { data: facebookMetrics } = useSocialMediaMetrics('facebook');
  const { data: instagramMetrics } = useSocialMediaMetrics('instagram');

  const latestFacebookMetrics = facebookMetrics?.[0];
  const latestInstagramMetrics = instagramMetrics?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organic Social Media Performance</h1>
          <p className="text-muted-foreground">
            Übersicht über deine organische Social Media Reichweite
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Facebook Follower"
            value={latestFacebookMetrics?.followers.toLocaleString() || "0"}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Gesamt Follower"
          />
          <StatsCard
            title="Facebook Reichweite"
            value={latestFacebookMetrics?.reach.toLocaleString() || "0"}
            icon={<Share2 className="h-4 w-4" />}
            description="Organische Reichweite"
          />
          <StatsCard
            title="Instagram Follower"
            value={latestInstagramMetrics?.followers.toLocaleString() || "0"}
            icon={<MessageCircle className="h-4 w-4" />}
            description="Gesamt Follower"
          />
          <StatsCard
            title="Instagram Reichweite"
            value={latestInstagramMetrics?.reach.toLocaleString() || "0"}
            icon={<Share2 className="h-4 w-4" />}
            description="Organische Reichweite"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialOrganic;
