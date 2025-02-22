
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy, FileText, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { LegalDocumentEditor } from "@/components/legal/LegalDocumentEditor";
import { useLegalDocument } from "@/hooks/useLegalDocuments";

const AdminOverview = () => {
  const { document: privacyDoc, isLoading: isPrivacyLoading, updateDocument: updatePrivacy } = useLegalDocument('privacy');
  const { document: termsDoc, isLoading: isTermsLoading, updateDocument: updateTerms } = useLegalDocument('terms');

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
          
          <Accordion type="single" collapsible>
            <AccordionItem value="privacy">
              <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
                <AccordionTrigger className="hover:no-underline flex-1">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Datenschutzerklärung</span>
                  </div>
                </AccordionTrigger>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard('/legal/privacy');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  URL kopieren
                </Button>
              </div>
              <AccordionContent className="px-4 pb-4">
                <LegalDocumentEditor
                  title="Datenschutzerklärung"
                  content={privacyDoc?.content ?? ''}
                  isLoading={isPrivacyLoading}
                  onSave={updatePrivacy}
                />
              </AccordionContent>
            </AccordionItem>
          
            <Separator />
          
            <AccordionItem value="terms">
              <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
                <AccordionTrigger className="hover:no-underline flex-1">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Nutzungsbedingungen</span>
                  </div>
                </AccordionTrigger>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard('/legal/terms');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  URL kopieren
                </Button>
              </div>
              <AccordionContent className="px-4 pb-4">
                <LegalDocumentEditor
                  title="Nutzungsbedingungen"
                  content={termsDoc?.content ?? ''}
                  isLoading={isTermsLoading}
                  onSave={updateTerms}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
