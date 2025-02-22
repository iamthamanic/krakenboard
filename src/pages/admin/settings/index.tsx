
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LegalDocumentEditor } from "@/components/legal/LegalDocumentEditor";
import { useLegalDocument } from "@/hooks/useLegalDocuments";

const Settings = () => {
  const { document: privacyDoc, isLoading: privacyLoading, updateDocument: updatePrivacy } = useLegalDocument('privacy');
  const { document: termsDoc, isLoading: termsLoading, updateDocument: updateTerms } = useLegalDocument('terms');

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
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Rechtliche Dokumente und wichtige Entwicklungseinstellungen
          </p>
        </div>

        <div className="space-y-6">
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

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="privacy">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="text-base font-medium">Datenschutzerklärung</AccordionTrigger>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard('/legal/privacy');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  URL kopieren
                </Button>
              </div>
              <AccordionContent>
                <div className="pt-4">
                  <LegalDocumentEditor
                    title="Datenschutzerklärung"
                    content={privacyDoc?.content ?? ''}
                    isLoading={privacyLoading}
                    onSave={updatePrivacy}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="text-base font-medium">Nutzungsbedingungen</AccordionTrigger>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard('/legal/terms');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  URL kopieren
                </Button>
              </div>
              <AccordionContent>
                <div className="pt-4">
                  <LegalDocumentEditor
                    title="Nutzungsbedingungen"
                    content={termsDoc?.content ?? ''}
                    isLoading={termsLoading}
                    onSave={updateTerms}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
