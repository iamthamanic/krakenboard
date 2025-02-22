
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const SettingsOverview = () => {
  const copyHomeUrl = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL wurde in die Zwischenablage kopiert");
    });
  };

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Startseite der Anwendung</CardTitle>
                  <CardDescription className="mt-1.5">
                    {window.location.origin}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyHomeUrl}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  URL kopieren
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsOverview;
