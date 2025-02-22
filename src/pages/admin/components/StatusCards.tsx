
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const StatusCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System-Status</CardTitle>
          <CardDescription>
            Aktuelle Systemauslastung und Performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">CPU-Auslastung</span>
              <span className="text-sm font-medium">32%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Speichernutzung</span>
              <span className="text-sm font-medium">2.1 GB / 8 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">API-Anfragen / Min</span>
              <span className="text-sm font-medium">142</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktive Integrationen</CardTitle>
          <CardDescription>
            Status der verbundenen Dienste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Google Analytics</span>
              <Badge variant="success">Aktiv</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Meta Business</span>
              <Badge variant="success">Aktiv</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Google Ads</span>
              <Badge variant="warning">Wartend</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
