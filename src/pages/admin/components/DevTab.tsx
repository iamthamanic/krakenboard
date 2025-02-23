import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, GitBranch, Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTechDocumentation } from "@/hooks/useTechDocumentation";

export const DevTab = () => {
  const { data: techDocs, isLoading } = useTechDocumentation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dev Log</CardTitle>
        <CardDescription>
          Technische Dokumentation für Entwickler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Lade Dokumentation...</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {techDocs?.find(doc => doc.category === 'stack') && (
              <AccordionItem value="stack">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Tech Stack
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Frontend</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'stack')?.content.frontend?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Backend</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'stack')?.content.backend?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {techDocs?.find(doc => doc.category === 'database') && (
              <AccordionItem value="database">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Datenbankstruktur
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Haupttabellen</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'database')?.content.tables?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Relations</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'database')?.content.relations?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {techDocs?.find(doc => doc.category === 'deployment') && (
              <AccordionItem value="deployment">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Deployment
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Infrastruktur</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'deployment')?.content.infrastructure?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">CI/CD Pipeline</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'deployment')?.content.pipeline?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {techDocs?.find(doc => doc.category === 'apis') && (
              <AccordionItem value="apis">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    API-Integrationen
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Aktive Integrationen</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'apis')?.content.implemented?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Verfügbare Integrationen</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {techDocs?.find(doc => doc.category === 'apis')?.content.integration?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};
