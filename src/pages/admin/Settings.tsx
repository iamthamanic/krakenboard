
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LegalDocumentEditor } from "@/components/legal/LegalDocumentEditor";
import { useLegalDocument } from "@/hooks/useLegalDocuments";
import { useIntegrations } from "@/hooks/useIntegrations";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Settings = () => {
  const { document: privacyDoc, isLoading: privacyLoading, updateDocument: updatePrivacy } = useLegalDocument('privacy');
  const { document: termsDoc, isLoading: termsLoading, updateDocument: updateTerms } = useLegalDocument('terms');
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations();

  const copyToClipboard = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL wurde in die Zwischenablage kopiert");
    });
  };

  const handleConnect = async (type: string) => {
    toast({
      title: "Info",
      description: "OAuth2-Integration wird implementiert...",
    });
  };

  const isIntegrationActive = (type: string) => {
    return integrations?.some(integration => 
      integration.type === type && integration.is_active
    ) ?? false;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen & Administration</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie hier die rechtlichen Dokumente und Integrationen der Anwendung.
          </p>
        </div>

        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="integrations">
              <AccordionTrigger className="text-xl font-semibold">Integrationen</AccordionTrigger>
              <AccordionContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Verbinde deine Accounts, um Echtzeitdaten in deinem Dashboard zu sehen.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Werbekonten</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Google Ads", type: "google_ads", description: "Performance Marketing & Search Ads" },
                        { title: "Meta Ads Manager", type: "meta_ads", description: "Facebook & Instagram Ads" },
                        { title: "LinkedIn Ads", type: "linkedin_ads", description: "B2B Marketing & Sponsored Content" },
                        { title: "TikTok Ads Manager", type: "tiktok_ads", description: "TikTok Werbekampagnen & Analytics" }
                      ].map((integration) => (
                        <Card key={integration.type} className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold">{integration.title}</h4>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                            <Button
                              variant={isIntegrationActive(integration.type) ? "outline" : "default"}
                              className={isIntegrationActive(integration.type) ? "border-green-500 text-green-500 hover:bg-green-50" : ""}
                              onClick={() => handleConnect(integration.type)}
                            >
                              {isIntegrationActive(integration.type) ? "Verbunden" : "Verbinden"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Organische Konten</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Google Analytics", type: "google_analytics", description: "Website Traffic & User Behavior" },
                        { title: "Meta Business Suite", type: "meta_business", description: "Facebook & Instagram Organic Performance" },
                        { title: "LinkedIn Company Page", type: "linkedin_company", description: "Organic Posts & Engagement" },
                        { title: "YouTube Studio", type: "youtube_studio", description: "Video Performance & Analytics" },
                        { title: "TikTok Business Center", type: "tiktok_business", description: "Organische TikTok Performance" }
                      ].map((integration) => (
                        <Card key={integration.type} className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold">{integration.title}</h4>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                            <Button
                              variant={isIntegrationActive(integration.type) ? "outline" : "default"}
                              className={isIntegrationActive(integration.type) ? "border-green-500 text-green-500 hover:bg-green-50" : ""}
                              onClick={() => handleConnect(integration.type)}
                            >
                              {isIntegrationActive(integration.type) ? "Verbunden" : "Verbinden"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

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
