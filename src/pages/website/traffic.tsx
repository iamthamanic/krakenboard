
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Globe, Users, LineChart, FormInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteScanner } from "@/services/websiteScanner";
import { toast } from "@/components/ui/use-toast";

const WebsiteTrafficPage = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine URL ein",
        variant: "destructive"
      });
      return;
    }

    try {
      setScanning(true);
      const scanner = new WebsiteScanner(url);
      const pages = await scanner.scanWebsite();
      
      // Zähle Gesamtanzahl der Formulare
      const totalForms = pages.reduce((sum, page) => sum + page.forms.length, 0);
      
      setPagesCount(pages.length);
      setFormsCount(totalForms);
      
      toast({
        title: "Scan abgeschlossen",
        description: `${pages.length} Seiten und ${totalForms} Formulare gefunden`
      });
    } catch (error) {
      toast({
        title: "Scan-Fehler",
        description: "Überprüfen Sie die URL und versuchen Sie es erneut",
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Traffic</h1>
          <p className="text-muted-foreground">Übersicht über Ihre Website-Besucher und Aktivitäten.</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Website URL eingeben (z.B. https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? "Scanne..." : "Website scannen"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gefundene Seiten"
            value={pagesCount}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Automatisch erkannt"
          />
          <StatsCard
            title="Aktuelle Besucher"
            value="--"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            description="GA4 Integration erforderlich"
          />
          <StatsCard
            title="Durchschn. Besuchszeit"
            value="--"
            icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
            description="GA4 Integration erforderlich"
          />
          <StatsCard
            title="Aktive Formulare"
            value={formsCount}
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            description="Automatisch erkannt"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTrafficPage;
