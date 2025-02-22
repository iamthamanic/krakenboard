
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebsiteScanner } from '@/hooks/useWebsiteScanner';
import { Loader2 } from 'lucide-react';

export const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const { scanning, startScan } = useWebsiteScanner();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      startScan(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website scannen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            type="url"
            placeholder="https://ihre-website.de"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={scanning}>
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanne...
              </>
            ) : (
              'Scan starten'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
