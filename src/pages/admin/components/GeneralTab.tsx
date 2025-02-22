
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users } from "lucide-react";

export const GeneralTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instanz-Einstellungen</CardTitle>
        <CardDescription>
          Grundlegende Einstellungen für deine KrakenBoard-Installation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/settings">
            <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <Settings className="h-6 w-6" />
                <div>
                  <h3 className="font-medium">System-Einstellungen</h3>
                  <p className="text-sm text-muted-foreground">
                    Konfiguriere Systemparameter und Defaults
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/admin/users">
            <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <Users className="h-6 w-6" />
                <div>
                  <h3 className="font-medium">Benutzerverwaltung</h3>
                  <p className="text-sm text-muted-foreground">
                    Verwalte Benutzer und Berechtigungen
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
