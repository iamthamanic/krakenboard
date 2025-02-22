
import { DiscoveredPagesTable } from '@/components/website/DiscoveredPagesTable';
import { useWebsiteScanner } from '@/hooks/useWebsiteScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ScannedPagesProps {
  websiteUrl: string;
}

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
          <CardTitle>Keine Seiten gefunden</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Starten Sie einen Scan, um Seiten zu entdecken.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gefundene Seiten</CardTitle>
      </CardHeader>
      <CardContent>
        <DiscoveredPagesTable pages={scanResult.pages} />
      </CardContent>
    </Card>
  );
};
