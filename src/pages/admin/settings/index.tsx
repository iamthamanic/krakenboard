import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ClipboardCopy, Loader2, RefreshCw } from "lucide-react";

type SmartcodeConfig = {
  instanceId: string;
  apiUrl: string;
  trackerScriptUrl: string;
};

const hashSeed = (value: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

const buildFallbackInstanceId = (baseUrl: string): string => {
  return `kb_${hashSeed(`${baseUrl}|a`)}${hashSeed(`${baseUrl}|b`)}`;
};

const Settings = () => {
  const [smartcodeConfig, setSmartcodeConfig] = useState<SmartcodeConfig | null>(null);
  const [smartcodeLoading, setSmartcodeLoading] = useState(true);
  const [smartcodeError, setSmartcodeError] = useState<string | null>(null);
  const [apiUrlValue, setApiUrlValue] = useState("");
  const [scriptUrlValue, setScriptUrlValue] = useState("");
  const [copied, setCopied] = useState(false);

  const loadSmartcodeConfig = useCallback(async () => {
    const fallbackBaseUrl = window.location.origin.replace(/\/+$/, "");
    const fallbackConfig: SmartcodeConfig = {
      instanceId: buildFallbackInstanceId(fallbackBaseUrl),
      apiUrl: `${fallbackBaseUrl}/api`,
      trackerScriptUrl: `${fallbackBaseUrl}/krakenboard-tracker-advanced.js`,
    };

    setSmartcodeLoading(true);
    setSmartcodeError(null);

    try {
      const response = await fetch("/api/track/smartcode-config");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const data = payload?.data as Partial<SmartcodeConfig> | undefined;

      if (!data?.instanceId || !data?.apiUrl || !data?.trackerScriptUrl) {
        throw new Error("Antwort enthält keine vollständige Smartcode-Konfiguration.");
      }

      const finalConfig: SmartcodeConfig = {
        instanceId: data.instanceId,
        apiUrl: data.apiUrl,
        trackerScriptUrl: data.trackerScriptUrl,
      };

      setSmartcodeConfig(finalConfig);
      setApiUrlValue(finalConfig.apiUrl);
      setScriptUrlValue(finalConfig.trackerScriptUrl);
    } catch (error) {
      setSmartcodeConfig(fallbackConfig);
      setApiUrlValue(fallbackConfig.apiUrl);
      setScriptUrlValue(fallbackConfig.trackerScriptUrl);
      setSmartcodeError("Smartcode-Konfiguration konnte nicht von der API geladen werden. Fallback wurde verwendet.");
      console.error("Failed to load smartcode config", error);
    } finally {
      setSmartcodeLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSmartcodeConfig();
  }, [loadSmartcodeConfig]);

  const generatedSmartcode = useMemo(() => {
    if (!smartcodeConfig) return "";

    const instanceId = smartcodeConfig.instanceId;
    const apiUrl = (apiUrlValue || smartcodeConfig.apiUrl).trim();
    const trackerScriptUrl = (scriptUrlValue || smartcodeConfig.trackerScriptUrl).trim();
    const separator = trackerScriptUrl.includes("?") ? "&" : "?";
    const scriptSrc = `${trackerScriptUrl}${separator}instanceId=${encodeURIComponent(instanceId)}`;

    return [
      "<!-- Krakenboard Smartcode -->",
      "<script>",
      "  window.KRAKENBOARD_TRACKER_CONFIG = {",
      `    apiUrl: "${apiUrl}",`,
      `    instanceId: "${instanceId}",`,
      "    debug: false",
      "  };",
      "</script>",
      `<script async defer src="${scriptSrc}"></script>`,
    ].join("\n");
  }, [smartcodeConfig, apiUrlValue, scriptUrlValue]);

  const handleCopySmartcode = async () => {
    if (!generatedSmartcode) return;

    try {
      await navigator.clipboard.writeText(generatedSmartcode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Clipboard API failed", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-2">
            Verwalte die Systemkonfiguration und Integrationen
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Änderungen an den Systemeinstellungen können die Performance beeinflussen.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="smartcode" className="space-y-4">
          <TabsList>
            <TabsTrigger value="smartcode">Smartcode</TabsTrigger>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="smartcode" className="space-y-4">
            {smartcodeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{smartcodeError}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Smartcode-Generator</CardTitle>
                <CardDescription>
                  Jeder Code ist an eine eindeutige Krakenboard-Instanz gebunden.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instance-id">Instanz-ID</Label>
                    <Input
                      id="instance-id"
                      value={smartcodeConfig?.instanceId || ""}
                      readOnly
                      placeholder="Wird geladen..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API-URL</Label>
                    <Input
                      id="api-url"
                      value={apiUrlValue}
                      onChange={(event) => setApiUrlValue(event.target.value)}
                      placeholder="https://deine-domain.com/api"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracker-url">Tracker Script URL</Label>
                  <Input
                    id="tracker-url"
                    value={scriptUrlValue}
                    onChange={(event) => setScriptUrlValue(event.target.value)}
                    placeholder="https://deine-domain.com/krakenboard-tracker-advanced.js"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smartcode">Einbaucode</Label>
                  <Textarea
                    id="smartcode"
                    value={generatedSmartcode}
                    readOnly
                    className="min-h-[220px] font-mono text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCopySmartcode} disabled={!generatedSmartcode}>
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    {copied ? "Kopiert" : "Smartcode kopieren"}
                  </Button>
                  <Button variant="outline" onClick={() => void loadSmartcodeConfig()} disabled={smartcodeLoading}>
                    {smartcodeLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Instanz neu laden
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration</CardTitle>
                <CardDescription>So bindest du den Smartcode auf deiner Website ein.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>1. Kopiere den generierten Code vollständig.</p>
                <p>2. Füge ihn direkt vor `&lt;/head&gt;` auf jeder Seite ein.</p>
                <p>3. Prüfe im Browser-Netzwerk, dass Requests an `/api/track/event` gesendet werden.</p>
                <Badge variant="secondary">
                  Instanz: {smartcodeConfig?.instanceId || "wird geladen..."}
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
                <CardDescription>Grundlegende Konfiguration des Systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Debug-Modus</h3>
                      <p className="text-sm text-muted-foreground">Aktiviert erweiterte Logging-Funktionen</p>
                    </div>
                    <Button variant="outline">Aktivieren</Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Cache Leeren</h3>
                      <p className="text-sm text-muted-foreground">Setzt den System-Cache zurück</p>
                    </div>
                    <Button variant="outline">Cache leeren</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scanning-Einstellungen</CardTitle>
                <CardDescription>Konfiguration der Website-Scanning-Funktionen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Scan-Intervall</h3>
                      <p className="text-sm text-muted-foreground">Legt fest, wie oft Websites gescannt werden</p>
                    </div>
                    <Button variant="outline">Konfigurieren</Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Crawling-Tiefe</h3>
                      <p className="text-sm text-muted-foreground">Maximale Tiefe beim Website-Scanning</p>
                    </div>
                    <Button variant="outline">Anpassen</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungs-Einstellungen</CardTitle>
                <CardDescription>Konfiguriere System- und Alert-Benachrichtigungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">E-Mail Benachrichtigungen</h3>
                      <p className="text-sm text-muted-foreground">Verwalte E-Mail Alert-Einstellungen</p>
                    </div>
                    <Badge variant="secondary">Aktiviert</Badge>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Slack Integration</h3>
                      <p className="text-sm text-muted-foreground">Benachrichtigungen via Slack</p>
                    </div>
                    <Badge variant="outline">Nicht konfiguriert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
