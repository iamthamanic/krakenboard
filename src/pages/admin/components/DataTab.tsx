
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export const DataTab = () => {
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
        </div>
      </CardContent>
    </Card>
  );
};
