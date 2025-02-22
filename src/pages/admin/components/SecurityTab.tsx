
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sicherheitseinstellungen</CardTitle>
        <CardDescription>
          Konfiguriere Sicherheitsrichtlinien und Zugriffskontrollen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-medium">API-Sicherheit</h3>
                <p className="text-sm text-muted-foreground">
                  Verwalte API-Keys und Zugriffsrechte
                </p>
              </div>
              <Button>Konfigurieren</Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
