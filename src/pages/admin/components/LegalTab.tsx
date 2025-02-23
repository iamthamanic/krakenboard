
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLegalDocument } from "@/hooks/useLegalDocuments";

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
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Datenschutzerklärung</h3>
                  <p className="text-sm text-muted-foreground">
                    Bearbeite die Datenschutzerklärung
                  </p>
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
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Nutzungsbedingungen</h3>
                  <p className="text-sm text-muted-foreground">
                    Bearbeite die Nutzungsbedingungen
                  </p>
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
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
