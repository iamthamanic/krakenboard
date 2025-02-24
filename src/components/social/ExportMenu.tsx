
import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExportMenuProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export const ExportMenu = ({ onExportPDF, onExportCSV }: ExportMenuProps) => {
  return (
    <Accordion type="single" collapsible className="w-[200px]">
      <AccordionItem value="export">
        <AccordionTrigger className="hover:no-underline px-4 py-2 bg-background border rounded-md">
          Export
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={onExportPDF} variant="ghost" className="justify-start">
              <FileDown className="mr-2 h-4 w-4" />
              Als PDF exportieren
            </Button>
            <Button onClick={onExportCSV} variant="ghost" className="justify-start">
              <Download className="mr-2 h-4 w-4" />
              Als CSV exportieren
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
