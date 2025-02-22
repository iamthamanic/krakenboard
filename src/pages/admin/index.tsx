
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy, FileText, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
          <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Startseite der Anwendung</span>
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
          
          <Separator />
          
          <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Datenschutzerklärung</span>
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
          
          <Separator />
          
          <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Nutzungsbedingungen</span>
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
    </AdminLayout>
  );
};

export default AdminOverview;
