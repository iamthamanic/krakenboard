
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plug } from "lucide-react";

const SettingsOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Der ganze Bums damit das hier ordentlich läuft
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Plug className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Integrationen</CardTitle>
                  <CardDescription>
                    API-Keys und Verbindungen zu externen Diensten
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsOverview;
