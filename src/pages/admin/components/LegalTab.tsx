
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLegalDocument } from "@/hooks/useLegalDocuments";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export const LegalTab = () => {
  const { 
    document: privacyDoc, 
    isLoading: isPrivacyLoading,
    updateDocument: updatePrivacy 
  } = useLegalDocument('privacy');
  
  const { 
    document: termsDoc, 
    isLoading: isTermsLoading,
    updateDocument: updateTerms 
  } = useLegalDocument('terms');

  const copyToClipboard = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link kopiert",
      description: "Der Link wurde in die Zwischenablage kopiert."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechtliche Dokumente</CardTitle>
        <CardDescription>
          Verwalte Datenschutzerklärung und Nutzungsbedingungen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="privacy" className="border rounded-lg">
            <AccordionTrigger className="px-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium text-left">Datenschutzerklärung</h3>
                  <p className="text-sm text-muted-foreground text-left">
                    Bearbeite die Datenschutzerklärung
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Zuletzt aktualisiert: {privacyDoc?.updated_at ? 
                      format(new Date(privacyDoc.updated_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de }) : 
                      'Noch nicht gespeichert'}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard('/legal/privacy')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Link kopieren
                  </Button>
                </div>
                <Textarea 
                  value={privacyDoc?.content || ''}
                  onChange={(e) => updatePrivacy(e.target.value)}
                  placeholder="Gib hier deine Datenschutzerklärung ein..."
                  className="min-h-[200px]"
                  disabled={isPrivacyLoading}
                />
                <Button 
                  onClick={() => updatePrivacy(privacyDoc?.content || '')}
                  disabled={isPrivacyLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aktualisieren
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="terms" className="border rounded-lg">
            <AccordionTrigger className="px-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium text-left">Nutzungsbedingungen</h3>
                  <p className="text-sm text-muted-foreground text-left">
                    Bearbeite die Nutzungsbedingungen
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Zuletzt aktualisiert: {termsDoc?.updated_at ? 
                      format(new Date(termsDoc.updated_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de }) : 
                      'Noch nicht gespeichert'}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard('/legal/terms')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Link kopieren
                  </Button>
                </div>
                <Textarea 
                  value={termsDoc?.content || ''}
                  onChange={(e) => updateTerms(e.target.value)}
                  placeholder="Gib hier deine Nutzungsbedingungen ein..."
                  className="min-h-[200px]"
                  disabled={isTermsLoading}
                />
                <Button 
                  onClick={() => updateTerms(termsDoc?.content || '')}
                  disabled={isTermsLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aktualisieren
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
