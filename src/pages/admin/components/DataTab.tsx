
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Key } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { GoogleAnalyticsService } from "@/services/oauth/GoogleAnalyticsService";

export const DataTab = () => {
  const handleConfigureOAuth = async () => {
    try {
      const authUrl = await GoogleAnalyticsService.initiateOAuth();
      window.open(authUrl, '_blank');
      
      toast({
        title: "OAuth2 Konfiguration",
        description: "Bitte folgen Sie den Anweisungen im neuen Fenster."
      });
    } catch (error) {
      console.error('OAuth error:', error);
      toast({
        title: "Fehler",
        description: "OAuth2 Konfiguration konnte nicht gestartet werden.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daten & APIs</CardTitle>
        <CardDescription>
          Verwalte Datenquellen und API-Integrationen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Database className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-medium">Datenbank-Einstellungen</h3>
                <p className="text-sm text-muted-foreground">
                  Konfiguriere Datenbank-Verbindungen und Backups
                </p>
              </div>
              <Button>Verwalten</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Key className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-medium">OAuth2 Konfiguration</h3>
                <p className="text-sm text-muted-foreground">
                  Google Analytics & Meta API Zugriff einrichten
                </p>
              </div>
              <Button onClick={handleConfigureOAuth}>Konfigurieren</Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
