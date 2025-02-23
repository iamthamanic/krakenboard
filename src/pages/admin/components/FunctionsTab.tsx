
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTechDocumentation } from "@/hooks/useTechDocumentation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FunctionItem = ({ 
  text, 
  isImplemented, 
  description 
}: { 
  text: string; 
  isImplemented: boolean; 
  description: string;
}) => (
  <div className="flex items-center gap-2">
    <span>{text}</span>
    {isImplemented && <CheckCircle2 className="h-4 w-4 text-green-500" />}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export const FunctionsTab = () => {
  const { data: techDocs } = useTechDocumentation();

  const getFunctionData = (category: string) => {
    const doc = techDocs?.find(doc => doc.category === 'functions')?.content[category];
    if (!doc) return [];
    return doc.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          text: item.name,
          isImplemented: item.implemented || false,
          description: item.description || 'Keine Beschreibung verfügbar'
        };
      }
      return {
        text: item,
        isImplemented: false,
        description: 'Keine Beschreibung verfügbar'
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Function Log</CardTitle>
        <CardDescription>
          Übersicht aller verfügbaren und geplanten KrakenBoard Funktionen
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
                  <div className="space-y-2">
                    {getFunctionData('website').map((item, index) => (
                      <FunctionItem 
                        key={index}
                        text={item.text}
                        isImplemented={item.isImplemented}
                        description={item.description}
                      />
                    ))}
                  </div>
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
                  <div className="space-y-2">
                    {getFunctionData('social').map((item, index) => (
                      <FunctionItem 
                        key={index}
                        text={item.text}
                        isImplemented={item.isImplemented}
                        description={item.description}
                      />
                    ))}
                  </div>
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
                  <div className="space-y-2">
                    {getFunctionData('ads').map((item, index) => (
                      <FunctionItem 
                        key={index}
                        text={item.text}
                        isImplemented={item.isImplemented}
                        description={item.description}
                      />
                    ))}
                  </div>
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
                  <div className="space-y-2">
                    {getFunctionData('automation').map((item, index) => (
                      <FunctionItem 
                        key={index}
                        text={item.text}
                        isImplemented={item.isImplemented}
                        description={item.description}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};
