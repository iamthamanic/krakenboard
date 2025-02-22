import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Settings, Users, Database, Shield, BookOpen, Code, GitBranch, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Verwalte deine KrakenBoard-Instanz und Einstellungen
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Willkommen im Admin-Bereich. Hier kannst du alle wichtigen Einstellungen vornehmen.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="data">Daten & APIs</TabsTrigger>
            <TabsTrigger value="functions">Function Log</TabsTrigger>
            <TabsTrigger value="dev">Dev Log</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instanz-Einstellungen</CardTitle>
                <CardDescription>
                  Grundlegende Einstellungen für deine KrakenBoard-Installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/admin/settings">
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Settings className="h-6 w-6" />
                        <div>
                          <h3 className="font-medium">System-Einstellungen</h3>
                          <p className="text-sm text-muted-foreground">
                            Konfiguriere Systemparameter und Defaults
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  <Link to="/admin/users">
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Users className="h-6 w-6" />
                        <div>
                          <h3 className="font-medium">Benutzerverwaltung</h3>
                          <p className="text-sm text-muted-foreground">
                            Verwalte Benutzer und Berechtigungen
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sicherheitseinstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere Sicherheitsrichtlinien und Zugriffskontrollen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-6 w-6" />
                      <div className="flex-1">
                        <h3 className="font-medium">API-Sicherheit</h3>
                        <p className="text-sm text-muted-foreground">
                          Verwalte API-Keys und Zugriffsrechte
                        </p>
                      </div>
                      <Button>Konfigurieren</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daten & APIs</CardTitle>
                <CardDescription>
                  Verwalte Datenquellen und API-Integrationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <Database className="h-6 w-6" />
                      <div className="flex-1">
                        <h3 className="font-medium">Datenbank-Einstellungen</h3>
                        <p className="text-sm text-muted-foreground">
                          Konfiguriere Datenbank-Verbindungen und Backups
                        </p>
                      </div>
                      <Button>Verwalten</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Function Log</CardTitle>
                <CardDescription>
                  Übersicht aller verfügbaren KrakenBoard Funktionen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="website">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Website Tracking & Analytics
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Automatische Erkennung aller Unterseiten via Sitemap oder Crawling</li>
                        <li>Formulare werden automatisch erkannt und getrackt</li>
                        <li>Conversion Tracking für alle Formulare</li>
                        <li>Fehlerrate-Monitoring für Formulareingaben</li>
                        <li>Echtzeit-Besucherstatistiken ohne Sampling</li>
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
                        <li>Facebook, Instagram & LinkedIn Performance Tracking</li>
                        <li>TikTok & YouTube Analytics Integration</li>
                        <li>Automatische Aggregation aller Social Media Metriken</li>
                        <li>Engagement & Reichweiten-Monitoring</li>
                        <li>Cross-Platform Performance Vergleich</li>
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
                        <li>Google Ads Performance Tracking</li>
                        <li>Meta Ads Integration</li>
                        <li>LinkedIn & TikTok Ads Monitoring</li>
                        <li>ROAS & CPC Analyse</li>
                        <li>Cross-Channel Attribution</li>
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
                        <li>Automatische Anomalie-Erkennung</li>
                        <li>KI-gestützte Performance Insights</li>
                        <li>Automatische Report-Generierung</li>
                        <li>Smart Alerts bei wichtigen Ereignissen</li>
                        <li>Predictive Analytics für Trends</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dev" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Developer Documentation</CardTitle>
                <CardDescription>
                  Technische Dokumentation für Entwickler
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
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
                            <li>React + TypeScript (Vite)</li>
                            <li>TailwindCSS für Styling</li>
                            <li>Shadcn/ui für UI Komponenten</li>
                            <li>React Query für Server State</li>
                            <li>React Router für Routing</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Backend</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Supabase für Datenbank & Auth</li>
                            <li>Edge Functions für Backend Logic</li>
                            <li>Row Level Security (RLS)</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

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
                            <li>websites - Gespeicherte Websites & Scan-Status</li>
                            <li>discovered_pages - Gefundene Unterseiten</li>
                            <li>forms - Erkannte Formulare</li>
                            <li>form_conversions - Formular-Conversions</li>
                            <li>integrations - API-Integrationen</li>
                            <li>api_metrics - Gesammelte Metriken</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Relations</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>websites → discovered_pages (1:n)</li>
                            <li>discovered_pages → forms (1:n)</li>
                            <li>forms → form_conversions (1:n)</li>
                            <li>integrations → api_metrics (1:n)</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="repository">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        Repository-Struktur
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>/src/components - UI Komponenten</li>
                        <li>/src/pages - Routen & Seitenkomponenten</li>
                        <li>/src/services - Business Logic & API Clients</li>
                        <li>/src/hooks - Custom React Hooks</li>
                        <li>/src/lib - Utilities & Helpers</li>
                        <li>/src/types - TypeScript Definitionen</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="apis">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        API-Integrationen
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Implementierte APIs</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Google Analytics 4</li>
                            <li>Google Ads</li>
                            <li>Facebook Marketing</li>
                            <li>Instagram Graph API</li>
                            <li>LinkedIn Marketing</li>
                            <li>TikTok Business</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Integration Pattern</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>OAuth2 Flow für Auth</li>
                            <li>Automatisches Token Refresh</li>
                            <li>Rate Limiting & Caching</li>
                            <li>Error Handling & Retry Logic</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="deployment">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Deployment
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Docker Container für die Anwendung</li>
                        <li>Supabase für Datenbank & Auth</li>
                        <li>Edge Functions für serverless Backend</li>
                        <li>Automatisches Deployment via CI/CD</li>
                        <li>Monitoring & Error Tracking</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System-Status</CardTitle>
              <CardDescription>
                Aktuelle Systemauslastung und Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">CPU-Auslastung</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Speichernutzung</span>
                  <span className="text-sm font-medium">2.1 GB / 8 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API-Anfragen / Min</span>
                  <span className="text-sm font-medium">142</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktive Integrationen</CardTitle>
              <CardDescription>
                Status der verbundenen Dienste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google Analytics</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meta Business</span>
                  <Badge variant="success">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google Ads</span>
                  <Badge variant="warning">Wartend</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
