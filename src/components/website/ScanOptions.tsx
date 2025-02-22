
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ScanOptionsProps {
  t: any;
  singleUrlOnly: boolean;
  setSingleUrlOnly: (value: boolean) => void;
  includedUrls: string[];
  excludedUrls: string[];
  newIncludeUrl: string;
  newExcludeUrl: string;
  setNewIncludeUrl: (value: string) => void;
  setNewExcludeUrl: (value: string) => void;
  handleAddIncludeUrl: () => void;
  handleAddExcludeUrl: () => void;
  handleRemoveIncludeUrl: (url: string) => void;
  handleRemoveExcludeUrl: (url: string) => void;
}

export const ScanOptions = ({
  t,
  singleUrlOnly,
  setSingleUrlOnly,
  includedUrls,
  excludedUrls,
  newIncludeUrl,
  newExcludeUrl,
  setNewIncludeUrl,
  setNewExcludeUrl,
  handleAddIncludeUrl,
  handleAddExcludeUrl,
  handleRemoveIncludeUrl,
  handleRemoveExcludeUrl,
}: ScanOptionsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="scan-options">
        <AccordionTrigger>{t.scanOptions}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="single-url"
                checked={singleUrlOnly}
                onCheckedChange={setSingleUrlOnly}
              />
              <label htmlFor="single-url" className="text-sm">
                {t.singleUrlScan}
              </label>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t.includedUrls}</h4>
              <div className="flex gap-2">
                <Input
                  placeholder={t.addUrl}
                  value={newIncludeUrl}
                  onChange={(e) => setNewIncludeUrl(e.target.value)}
                />
                <Button onClick={handleAddIncludeUrl} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {includedUrls.map((url) => (
                  <Badge key={url} variant="secondary" className="flex items-center gap-1">
                    {url}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveIncludeUrl(url)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t.excludedUrls}</h4>
              <div className="flex gap-2">
                <Input
                  placeholder={t.addUrl}
                  value={newExcludeUrl}
                  onChange={(e) => setNewExcludeUrl(e.target.value)}
                />
                <Button onClick={handleAddExcludeUrl} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {excludedUrls.map((url) => (
                  <Badge key={url} variant="secondary" className="flex items-center gap-1">
                    {url}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveExcludeUrl(url)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
