
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, MessageCircle, Share2, Users, Video } from "lucide-react";
import { SocialMediaMetrics } from "@/services/integrations/SocialMediaService";

interface PlatformMetricsProps {
  title: string;
  icon?: JSX.Element;
  latestMetrics?: SocialMediaMetrics;
  previousMetrics?: SocialMediaMetrics;
  useVideoIcon?: boolean;
}

interface TrendType {
  value: number;
  isPositive: boolean;
}

export const PlatformMetrics = ({
  title,
  latestMetrics,
  previousMetrics,
  useVideoIcon
}: PlatformMetricsProps) => {
  const calculateTrend = (current?: number, previous?: number): TrendType | undefined => {
    if (!current || !previous) return undefined;
    return {
      value: Math.round(((current - previous) / previous) * 100),
      isPositive: current >= previous
    };
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Follower"
          value={latestMetrics?.followers.toLocaleString() || "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestMetrics?.followers,
            previousMetrics?.followers
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title={useVideoIcon ? "Views" : "Reichweite"}
          value={latestMetrics?.reach.toLocaleString() || "0"}
          icon={useVideoIcon ? 
            <Video className="h-4 w-4 text-muted-foreground" /> : 
            <Share2 className="h-4 w-4 text-muted-foreground" />
          }
          trend={calculateTrend(
            latestMetrics?.reach,
            previousMetrics?.reach
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${(latestMetrics?.engagement_rate || 0).toFixed(1)}%`}
          icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestMetrics?.engagement_rate,
            previousMetrics?.engagement_rate
          )}
          description="vs. letzter Zeitraum"
        />
        <StatsCard
          title="Interaktionen"
          value={latestMetrics?.interactions.toLocaleString() || "0"}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          trend={calculateTrend(
            latestMetrics?.interactions,
            previousMetrics?.interactions
          )}
          description="vs. letzter Zeitraum"
        />
      </div>
    </div>
  );
};
