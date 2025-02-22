
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const AdminOverview = () => {
  const copyToClipboard = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL wurde in die Zwischenablage kopiert");
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="text-muted-foreground mt-2">
            Wichtiger Scheiß für die Entwicklung
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="text-base font-medium">Startseite der Anwendung</div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard('/')}
            >
              <Copy className="h-4 w-4 mr-2" />
              URL kopieren
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="text-base font-medium">Datenschutzerklärung</div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard('/legal/privacy')}
            >
              <Copy className="h-4 w-4 mr-2" />
              URL kopieren
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="text-base font-medium">Nutzungsbedingungen</div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard('/legal/terms')}
            >
              <Copy className="h-4 w-4 mr-2" />
              URL kopieren
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
