
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const Features = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Features & Administration</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie hier die rechtlichen Dokumente und Hauptfunktionen der Anwendung.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Wichtige URLs</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Startseite</h3>
                <p className="text-sm text-muted-foreground">{window.location.origin}/</p>
              </div>
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
              <div>
                <h3 className="font-medium">Datenschutzerklärung</h3>
                <p className="text-sm text-muted-foreground">{window.location.origin}/legal/privacy</p>
              </div>
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
              <div>
                <h3 className="font-medium">Nutzungsbedingungen</h3>
                <p className="text-sm text-muted-foreground">{window.location.origin}/legal/terms</p>
              </div>
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
      </div>
    </AdminLayout>
  );
};
