
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SocialMediaChart } from "@/components/dashboard/SocialMediaChart";
import { useSocialMediaMetrics } from "@/hooks/useSocialMediaMetrics";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { ExportMenu } from "@/components/social/ExportMenu";
import { PlatformMetrics } from "@/components/social/PlatformMetrics";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

const SocialOrganic = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const { data: facebookMetrics } = useSocialMediaMetrics('facebook');
  const { data: instagramMetrics } = useSocialMediaMetrics('instagram');
  const { data: linkedinMetrics } = useSocialMediaMetrics('linkedin');
  const { data: youtubeMetrics } = useSocialMediaMetrics('youtube');
  const { data: tiktokMetrics } = useSocialMediaMetrics('tiktok');

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Social Media Metriken', 14, 15);
    doc.setFontSize(12);
    
    const allData = [
      ['Plattform', 'Follower', 'Reichweite', 'Engagement Rate', 'Interaktionen'],
      ['Facebook', 
        facebookMetrics?.[0]?.followers || 0,
        facebookMetrics?.[0]?.reach || 0,
        `${(facebookMetrics?.[0]?.engagement_rate || 0).toFixed(1)}%`,
        facebookMetrics?.[0]?.interactions || 0
      ],
      ['Instagram',
        instagramMetrics?.[0]?.followers || 0,
        instagramMetrics?.[0]?.reach || 0,
        `${(instagramMetrics?.[0]?.engagement_rate || 0).toFixed(1)}%`,
        instagramMetrics?.[0]?.interactions || 0
      ],
      ['LinkedIn',
        linkedinMetrics?.[0]?.followers || 0,
        linkedinMetrics?.[0]?.reach || 0,
        `${(linkedinMetrics?.[0]?.engagement_rate || 0).toFixed(1)}%`,
        linkedinMetrics?.[0]?.interactions || 0
      ],
      ['YouTube',
        youtubeMetrics?.[0]?.followers || 0,
        youtubeMetrics?.[0]?.reach || 0,
        `${(youtubeMetrics?.[0]?.engagement_rate || 0).toFixed(1)}%`,
        youtubeMetrics?.[0]?.interactions || 0
      ],
      ['TikTok',
        tiktokMetrics?.[0]?.followers || 0,
        tiktokMetrics?.[0]?.reach || 0,
        `${(tiktokMetrics?.[0]?.engagement_rate || 0).toFixed(1)}%`,
        tiktokMetrics?.[0]?.interactions || 0
      ]
    ];

    autoTable(doc, {
      head: [allData[0]],
      body: allData.slice(1),
      startY: 25,
    });

    doc.save(`social-media-metrics-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
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
    link.setAttribute('download', `social-media-metrics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Export erfolgreich');
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
            <DateRangeSelector
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
              timeRanges={TIME_RANGES}
            />
            <ExportMenu
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
            />
          </div>
        </div>

        <div className="space-y-6">
          <PlatformMetrics
            title="Facebook"
            latestMetrics={facebookMetrics?.[0]}
            previousMetrics={facebookMetrics?.[1]}
          />
          
          <PlatformMetrics
            title="Instagram"
            latestMetrics={instagramMetrics?.[0]}
            previousMetrics={instagramMetrics?.[1]}
          />
          
          <PlatformMetrics
            title="LinkedIn"
            latestMetrics={linkedinMetrics?.[0]}
            previousMetrics={linkedinMetrics?.[1]}
          />
          
          <PlatformMetrics
            title="YouTube"
            latestMetrics={youtubeMetrics?.[0]}
            previousMetrics={youtubeMetrics?.[1]}
          />
          
          <PlatformMetrics
            title="TikTok"
            latestMetrics={tiktokMetrics?.[0]}
            previousMetrics={tiktokMetrics?.[1]}
            useVideoIcon
          />
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
    </DashboardLayout>
  );
};

export default SocialOrganic;
