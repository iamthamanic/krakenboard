
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTechDocumentation } from "@/hooks/useTechDocumentation";

export const FunctionsTab = () => {
  const { data: techDocs } = useTechDocumentation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Function Log</CardTitle>
        <CardDescription>
          Übersicht aller verfügbaren KrakenBoard Funktionen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {techDocs?.find(doc => doc.category === 'functions') && (
            <>
              <AccordionItem value="website">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Website Tracking & Analytics
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {techDocs?.find(doc => doc.category === 'functions')?.content.website?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="social">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Social Media Integration
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {techDocs?.find(doc => doc.category === 'functions')?.content.social?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ads">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Paid Advertising
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {techDocs?.find(doc => doc.category === 'functions')?.content.ads?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="automation">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Automatisierung & KI
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {techDocs?.find(doc => doc.category === 'functions')?.content.automation?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};
