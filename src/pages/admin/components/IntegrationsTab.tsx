
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const IntegrationsTab = () => {
  const handleGoogleAuth = async () => {
    // TODO: Implementiere Google OAuth Flow
    console.log("Starting Google OAuth flow");
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Verbinde deine Marketing-Tools für automatische Datenanalysen
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics</CardTitle>
            <CardDescription>
              Verbinde Google Analytics 4 für detaillierte Website-Analysen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <Badge variant="warning">Nicht verbunden</Badge>
              </div>
              <Button onClick={handleGoogleAuth}>
                Verbinden
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weitere Integration Cards hier */}
      </div>
    </div>
  );
};
