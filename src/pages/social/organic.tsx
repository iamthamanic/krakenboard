
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, MessageCircle, Share2, Users } from "lucide-react";
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";

const SocialOrganic = () => {
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
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organic Social Media Performance</h1>
          <p className="text-muted-foreground">
            Übersicht über deine organische Social Media Reichweite
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Facebook</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Follower"
                value={latestFacebookMetrics?.followers.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestFacebookMetrics?.followers,
                  previousFacebookMetrics?.followers
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Reichweite"
                value={latestFacebookMetrics?.reach.toLocaleString() || "0"}
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestFacebookMetrics?.reach,
                  previousFacebookMetrics?.reach
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Engagement Rate"
                value={`${(latestFacebookMetrics?.engagement_rate || 0).toFixed(1)}%`}
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestFacebookMetrics?.engagement_rate,
                  previousFacebookMetrics?.engagement_rate
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Interaktionen"
                value={latestFacebookMetrics?.interactions.toLocaleString() || "0"}
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestFacebookMetrics?.interactions,
                  previousFacebookMetrics?.interactions
                )}
                description="vs. letzter Zeitraum"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Instagram</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Follower"
                value={latestInstagramMetrics?.followers.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestInstagramMetrics?.followers,
                  previousInstagramMetrics?.followers
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Reichweite"
                value={latestInstagramMetrics?.reach.toLocaleString() || "0"}
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestInstagramMetrics?.reach,
                  previousInstagramMetrics?.reach
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Engagement Rate"
                value={`${(latestInstagramMetrics?.engagement_rate || 0).toFixed(1)}%`}
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestInstagramMetrics?.engagement_rate,
                  previousInstagramMetrics?.engagement_rate
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Interaktionen"
                value={latestInstagramMetrics?.interactions.toLocaleString() || "0"}
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestInstagramMetrics?.interactions,
                  previousInstagramMetrics?.interactions
                )}
                description="vs. letzter Zeitraum"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">LinkedIn</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Follower"
                value={latestLinkedinMetrics?.followers.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestLinkedinMetrics?.followers,
                  previousLinkedinMetrics?.followers
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Reichweite"
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
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestLinkedinMetrics?.interactions,
                  previousLinkedinMetrics?.interactions
                )}
                description="vs. letzter Zeitraum"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialOrganic;
