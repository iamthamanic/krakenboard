
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Globe, Users, LineChart, FormInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteScanner } from "@/services/websiteScanner";
import { toast } from "@/components/ui/use-toast";
import { ScanProgress as ScanProgressType, DiscoveredPage } from "@/services/types/scanner.types";
import { translations, getStoredLanguage } from "@/lib/utils";
import { ScanOptions } from "@/components/website/ScanOptions";
import { ScanProgress } from "@/components/website/ScanProgress";
import { DiscoveredPagesTable } from "@/components/website/DiscoveredPagesTable";

const WebsiteTrafficPage = () => {
  const t = translations[getStoredLanguage()];
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [progress, setProgress] = useState<ScanProgressType | null>(null);
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPage[]>([]);
  const [includedUrls, setIncludedUrls] = useState<string[]>([]);
  const [excludedUrls, setExcludedUrls] = useState<string[]>([]);
  const [singleUrlOnly, setSingleUrlOnly] = useState(false);
  const [newIncludeUrl, setNewIncludeUrl] = useState("");
  const [newExcludeUrl, setNewExcludeUrl] = useState("");

  const handleScan = async () => {
    if (!url) {
      toast({
        title: t.scanError,
        description: t.enterUrl,
        variant: "destructive"
      });
      return;
    }

    try {
      setScanning(true);
      setProgress(null);
      setDiscoveredPages([]);
      
      const scanner = new WebsiteScanner(url, (progress) => {
        setProgress(progress);
      }, {
        includedUrls,
        excludedUrls,
        singleUrlOnly
      });
      
      const pages = await scanner.scanWebsite();
      const totalForms = pages.reduce((sum, page) => sum + page.forms.length, 0);
      
      setPagesCount(pages.length);
      setFormsCount(totalForms);
      setDiscoveredPages(pages);
      
      toast({
        title: t.scanComplete,
        description: `${pages.length} ${t.pagesAndForms}`
      });
    } catch (error) {
      toast({
        title: t.scanFailed,
        description: t.checkUrlAndRetry,
        variant: "destructive"
      });
    } finally {
      setScanning(false);
      setProgress(null);
    }
  };

  const handleAddIncludeUrl = () => {
    if (newIncludeUrl && !includedUrls.includes(newIncludeUrl)) {
      setIncludedUrls([...includedUrls, newIncludeUrl]);
      setNewIncludeUrl("");
    }
  };

  const handleAddExcludeUrl = () => {
    if (newExcludeUrl && !excludedUrls.includes(newExcludeUrl)) {
      setExcludedUrls([...excludedUrls, newExcludeUrl]);
      setNewExcludeUrl("");
    }
  };

  const handleRemoveIncludeUrl = (urlToRemove: string) => {
    setIncludedUrls(includedUrls.filter(url => url !== urlToRemove));
  };

  const handleRemoveExcludeUrl = (urlToRemove: string) => {
    setExcludedUrls(excludedUrls.filter(url => url !== urlToRemove));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.websiteTraffic}</h1>
          <p className="text-muted-foreground">{t.websiteTrafficDescription}</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder={t.enterWebsiteUrl}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleScan}
              disabled={scanning}
            >
              {scanning ? t.scanning : t.scanWebsite}
            </Button>
          </div>

          <ScanOptions
            t={t}
            singleUrlOnly={singleUrlOnly}
            setSingleUrlOnly={setSingleUrlOnly}
            includedUrls={includedUrls}
            excludedUrls={excludedUrls}
            newIncludeUrl={newIncludeUrl}
            newExcludeUrl={newExcludeUrl}
            setNewIncludeUrl={setNewIncludeUrl}
            setNewExcludeUrl={setNewExcludeUrl}
            handleAddIncludeUrl={handleAddIncludeUrl}
            handleAddExcludeUrl={handleAddExcludeUrl}
            handleRemoveIncludeUrl={handleRemoveIncludeUrl}
            handleRemoveExcludeUrl={handleRemoveExcludeUrl}
          />

          {progress && <ScanProgress progress={progress} t={t} />}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t.discoveredPages}
            value={pagesCount}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description={t.autoDetected}
          />
          <StatsCard
            title={t.currentVisitors}
            value="--"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            description={t.ga4Required}
          />
          <StatsCard
            title={t.avgVisitTime}
            value="--"
            icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
            description={t.ga4Required}
          />
          <StatsCard
            title={t.activeForms}
            value={formsCount}
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            description={t.autoDetected}
          />
        </div>

        {discoveredPages.length > 0 && (
          <DiscoveredPagesTable pages={discoveredPages} t={t} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTrafficPage;
