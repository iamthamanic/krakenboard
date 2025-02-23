import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SocialMediaChart } from "@/components/dashboard/SocialMediaChart";
import { BarChart3, Download, MessageCircle, Share2, Users, Video } from "lucide-react";
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage'
};

const SocialOrganic = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { data: facebookMetrics } = useSocialMediaMetrics('facebook');
  const { data: instagramMetrics } = useSocialMediaMetrics('instagram');
  const { data: linkedinMetrics } = useSocialMediaMetrics('linkedin');
  const { data: youtubeMetrics } = useSocialMediaMetrics('youtube');
  const { data: tiktokMetrics } = useSocialMediaMetrics('tiktok');

  const latestFacebookMetrics = facebookMetrics?.[0];
  const previousFacebookMetrics = facebookMetrics?.[1];
  
  const latestInstagramMetrics = instagramMetrics?.[0];
  const previousInstagramMetrics = instagramMetrics?.[1];
  
  const latestLinkedinMetrics = linkedinMetrics?.[0];
  const previousLinkedinMetrics = linkedinMetrics?.[1];

  const latestYoutubeMetrics = youtubeMetrics?.[0];
  const previousYoutubeMetrics = youtubeMetrics?.[1];

  const latestTiktokMetrics = tiktokMetrics?.[0];
  const previousTiktokMetrics = tiktokMetrics?.[1];

  const calculateTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return undefined;
    return {
      value: Math.round(((current - previous) / previous) * 100),
      isPositive: current >= previous
    };
  };

  const handleExport = () => {
    const allData = {
      facebook: facebookMetrics,
      instagram: instagramMetrics,
      linkedin: linkedinMetrics,
      youtube: youtubeMetrics,
      tiktok: tiktokMetrics
    };

    const csv = Object.entries(allData).map(([platform, metrics]) => {
      if (!metrics) return '';
      
      return metrics.map(metric => ({
        Platform: platform,
        Timestamp: new Date(metric.timestamp).toLocaleString(),
        Followers: metric.followers,
        Reach: metric.reach,
        'Engagement Rate': `${metric.engagement_rate.toFixed(1)}%`,
        Interactions: metric.interactions
      }));
    }).flat();

    const csvString = [
      Object.keys(csv[0]).join(','),
      ...csv.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `social-media-metrics-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export erfolgreich');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organic Social Media Performance</h1>
            <p className="text-muted-foreground">
              Übersicht über deine organische Social Media Reichweite
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zeitraum wählen" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_RANGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
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

          <div>
            <h2 className="text-xl font-semibold mb-4">YouTube</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Abonnenten"
                value={latestYoutubeMetrics?.followers.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestYoutubeMetrics?.followers,
                  previousYoutubeMetrics?.followers
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Aufrufe"
                value={latestYoutubeMetrics?.reach.toLocaleString() || "0"}
                icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestYoutubeMetrics?.reach,
                  previousYoutubeMetrics?.reach
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Engagement Rate"
                value={`${(latestYoutubeMetrics?.engagement_rate || 0).toFixed(1)}%`}
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestYoutubeMetrics?.engagement_rate,
                  previousYoutubeMetrics?.engagement_rate
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Interaktionen"
                value={latestYoutubeMetrics?.interactions.toLocaleString() || "0"}
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestYoutubeMetrics?.interactions,
                  previousYoutubeMetrics?.interactions
                )}
                description="vs. letzter Zeitraum"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">TikTok</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Follower"
                value={latestTiktokMetrics?.followers.toLocaleString() || "0"}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestTiktokMetrics?.followers,
                  previousTiktokMetrics?.followers
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Views"
                value={latestTiktokMetrics?.reach.toLocaleString() || "0"}
                icon={<Video className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestTiktokMetrics?.reach,
                  previousTiktokMetrics?.reach
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Engagement Rate"
                value={`${(latestTiktokMetrics?.engagement_rate || 0).toFixed(1)}%`}
                icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestTiktokMetrics?.engagement_rate,
                  previousTiktokMetrics?.engagement_rate
                )}
                description="vs. letzter Zeitraum"
              />
              <StatsCard
                title="Interaktionen"
                value={latestTiktokMetrics?.interactions.toLocaleString() || "0"}
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend={calculateTrend(
                  latestTiktokMetrics?.interactions,
                  previousTiktokMetrics?.interactions
                )}
                description="vs. letzter Zeitraum"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SocialMediaChart 
              data={facebookMetrics || []} 
              metric="followers" 
              title="Facebook Follower Entwicklung" 
            />
            <SocialMediaChart 
              data={instagramMetrics || []} 
              metric="followers" 
              title="Instagram Follower Entwicklung" 
            />
            <SocialMediaChart 
              data={linkedinMetrics || []} 
              metric="followers" 
              title="LinkedIn Follower Entwicklung" 
            />
            <SocialMediaChart 
              data={youtubeMetrics || []} 
              metric="followers" 
              title="YouTube Abonnenten Entwicklung" 
            />
            <SocialMediaChart 
              data={tiktokMetrics || []} 
              metric="followers" 
              title="TikTok Follower Entwicklung" 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SocialMediaChart 
              data={facebookMetrics || []} 
              metric="reach" 
              title="Facebook Reichweite" 
            />
            <SocialMediaChart 
              data={instagramMetrics || []} 
              metric="reach" 
              title="Instagram Reichweite" 
            />
            <SocialMediaChart 
              data={linkedinMetrics || []} 
              metric="reach" 
              title="LinkedIn Reichweite" 
            />
            <SocialMediaChart 
              data={youtubeMetrics || []} 
              metric="reach" 
              title="YouTube Aufrufe" 
            />
            <SocialMediaChart 
              data={tiktokMetrics || []} 
              metric="reach" 
              title="TikTok Views" 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SocialMediaChart 
              data={facebookMetrics || []} 
              metric="engagement_rate" 
              title="Facebook Engagement Rate" 
            />
            <SocialMediaChart 
              data={instagramMetrics || []} 
              metric="engagement_rate" 
              title="Instagram Engagement Rate" 
            />
            <SocialMediaChart 
              data={linkedinMetrics || []} 
              metric="engagement_rate" 
              title="LinkedIn Engagement Rate" 
            />
            <SocialMediaChart 
              data={youtubeMetrics || []} 
              metric="engagement_rate" 
              title="YouTube Engagement Rate" 
            />
            <SocialMediaChart 
              data={tiktokMetrics || []} 
              metric="engagement_rate" 
              title="TikTok Engagement Rate" 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialOrganic;
