
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Globe, Users, LineChart, FormInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { WebsiteScanner } from "@/services/websiteScanner";
import { toast } from "@/components/ui/use-toast";
import { ScanProgress, DiscoveredPage } from "@/services/types/scanner.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WebsiteTrafficPage = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPage[]>([]);

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
      setProgress(null);
      setDiscoveredPages([]);
      
      const scanner = new WebsiteScanner(url, (progress) => {
        setProgress(progress);
      });
      
      const pages = await scanner.scanWebsite();
      const totalForms = pages.reduce((sum, page) => sum + page.forms.length, 0);
      
      setPagesCount(pages.length);
      setFormsCount(totalForms);
      setDiscoveredPages(pages);
      
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
      setProgress(null);
    }
  };

  const getFormTypeColor = (type: string) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'dynamic':
        return 'bg-purple-100 text-purple-800';
      case 'multi-step':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Traffic</h1>
          <p className="text-muted-foreground">Übersicht über Ihre Website-Besucher und Aktivitäten.</p>
        </div>

        <div className="space-y-4">
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

          {progress && (
            <div className="space-y-2">
              <Progress value={(progress.scannedPages / progress.totalPages) * 100} />
              <div className="text-sm text-muted-foreground">
                <p>Scanne {progress.currentUrl}</p>
                <p>{progress.scannedPages} von {progress.totalPages} Seiten gescannt</p>
                <p>Geschätzte Restzeit: {progress.estimatedTimeRemaining}</p>
              </div>
            </div>
          )}
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

        {discoveredPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gefundene Seiten & Formulare</CardTitle>
              <CardDescription>
                Übersicht aller erkannten Seiten und deren Formulare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seite</TableHead>
                    <TableHead>Formulare</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discoveredPages.map((page) => (
                    <TableRow key={page.url}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-muted-foreground">{page.url}</div>
                        </div>
                      </TableCell>
                      <TableCell>{page.forms.length}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {page.forms.map((form, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getFormTypeColor(form.type)}
                                  variant="secondary"
                                >
                                  {form.type}
                                </Badge>
                                {form.steps && form.steps > 1 && (
                                  <Badge variant="outline">
                                    {form.steps} Schritte
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {form.fields} Felder
                                {form.successPage && (
                                  <span className="ml-2">• Erfolgsseite vorhanden</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTrafficPage;
