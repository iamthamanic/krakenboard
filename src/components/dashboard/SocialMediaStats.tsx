
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Share2, MessageCircle, ChartBar } from "lucide-react";
import { StatsCard } from "./StatsCard";

export const SocialMediaStats = () => {
  const { data: facebookMetrics } = useSocialMediaMetrics('facebook');
  const { data: instagramMetrics } = useSocialMediaMetrics('instagram');
  const { data: linkedinMetrics } = useSocialMediaMetrics('linkedin');

  const latestFacebookMetrics = facebookMetrics?.[0];
  const previousFacebookMetrics = facebookMetrics?.[1];
  
  const latestInstagramMetrics = instagramMetrics?.[0];
  const previousInstagramMetrics = instagramMetrics?.[1];
  
  const latestLinkedinMetrics = linkedinMetrics?.[0];
  const previousLinkedinMetrics = linkedinMetrics?.[1];

  const calculateTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return undefined;
    return {
      value: Math.round(((current - previous) / previous) * 100),
      isPositive: current >= previous
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Social Media Performance</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Facebook Follower"
          value={latestFacebookMetrics?.followers.toLocaleString() || "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestFacebookMetrics?.followers,
            previousFacebookMetrics?.followers
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Facebook Reichweite"
          value={latestFacebookMetrics?.reach.toLocaleString() || "0"}
          icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestFacebookMetrics?.reach,
            previousFacebookMetrics?.reach
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Instagram Follower"
          value={latestInstagramMetrics?.followers.toLocaleString() || "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestInstagramMetrics?.followers,
            previousInstagramMetrics?.followers
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Instagram Reichweite"
          value={latestInstagramMetrics?.reach.toLocaleString() || "0"}
          icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestInstagramMetrics?.reach,
            previousInstagramMetrics?.reach
          )}
          description="vs. letzter Zeitraum"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="LinkedIn Follower"
          value={latestLinkedinMetrics?.followers.toLocaleString() || "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestLinkedinMetrics?.followers,
            previousLinkedinMetrics?.followers
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="LinkedIn Reichweite"
          value={latestLinkedinMetrics?.reach.toLocaleString() || "0"}
          icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestLinkedinMetrics?.reach,
            previousLinkedinMetrics?.reach
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${(latestLinkedinMetrics?.engagement_rate || 0).toFixed(1)}%`}
          icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestLinkedinMetrics?.engagement_rate,
            previousLinkedinMetrics?.engagement_rate
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Interaktionen"
          value={latestLinkedinMetrics?.interactions.toLocaleString() || "0"}
          icon={<ChartBar className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestLinkedinMetrics?.interactions,
            previousLinkedinMetrics?.interactions
          )}
          description="vs. letzter Zeitraum"
        />
      </div>
    </div>
  );
};
