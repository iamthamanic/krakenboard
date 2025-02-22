
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FormElement } from "@/services/types/scanner.types";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, Send, CheckCircle, AlertCircle } from "lucide-react";
import { FormMonitoringDashboard } from "./FormMonitoringDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormAnalyticsProps {
  form: FormElement;
}

export const FormAnalytics = ({ form }: FormAnalyticsProps) => {
  const getFormTypeColor = (type: string) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'dynamic':
        return 'bg-purple-100 text-purple-800';
      case 'multi-step':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Formular Details</CardTitle>
            <CardDescription>Detaillierte Analyse des erkannten Formulars</CardDescription>
          </div>
          <Badge className={getFormTypeColor(form.type)} variant="secondary">
            {form.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6">
              {/* Formular Übersicht */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-4 border rounded-lg">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{form.fields}</p>
                    <p className="text-xs text-muted-foreground">Formularfelder</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 border rounded-lg">
                  <Send className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{form.method || 'POST'}</p>
                    <p className="text-xs text-muted-foreground">Submit Methode</p>
                  </div>
                </div>
                {form.successPage ? (
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Dankeseite vorhanden</p>
                      <p className="text-xs text-muted-foreground">Conversion tracking möglich</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Keine Dankeseite</p>
                      <p className="text-xs text-muted-foreground">Conversion tracking eingeschränkt</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Formularfelder Tabelle */}
              {form.inputs && form.inputs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Erkannte Formularfelder</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Pflichtfeld</TableHead>
                        <TableHead>Label</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.inputs.map((input, index) => (
                        <TableRow key={index}>
                          <TableCell>{input.name}</TableCell>
                          <TableCell>{input.type}</TableCell>
                          <TableCell>
                            {input.required ? (
                              <Badge variant="default">Ja</Badge>
                            ) : (
                              <Badge variant="outline">Nein</Badge>
                            )}
                          </TableCell>
                          <TableCell>{input.label || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <FormMonitoringDashboard form={form} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
