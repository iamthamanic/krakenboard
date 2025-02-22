
import { DiscoveredPagesTable } from '@/components/website/DiscoveredPagesTable';
import { useWebsiteScanner } from '@/hooks/useWebsiteScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ScannedPagesProps {
  websiteUrl: string;
}

const translations = {
  noPages: "Keine Seiten gefunden",
  startScan: "Starten Sie einen Scan, um Seiten zu entdecken.",
  foundPages: "Gefundene Seiten",
  page: "Seite",
  forms: "Formulare",
  details: "Details",
  steps: "Schritte",
  fields: "Felder",
  successPageExists: "Erfolgsseite vorhanden",
  discoveredPagesAndForms: "Entdeckte Seiten und Formulare",
  discoveredPagesDescription: "Übersicht aller gefundenen Seiten und ihrer Formulare"
};

export const ScannedPages = ({ websiteUrl }: ScannedPagesProps) => {
  const { scanResult, isLoadingResults } = useWebsiteScanner(websiteUrl);

  if (isLoadingResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!scanResult?.pages?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.noPages}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {translations.startScan}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.foundPages}</CardTitle>
      </CardHeader>
      <CardContent>
        <DiscoveredPagesTable pages={scanResult.pages} t={translations} />
      </CardContent>
    </Card>
  );
};
