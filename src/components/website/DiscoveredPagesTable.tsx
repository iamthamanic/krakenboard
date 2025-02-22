
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DiscoveredPage } from "@/services/types/scanner.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DiscoveredPagesTableProps {
  pages: DiscoveredPage[];
  t: any;
}

export const DiscoveredPagesTable = ({ pages, t }: DiscoveredPagesTableProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle>{t.discoveredPagesAndForms}</CardTitle>
        <CardDescription>
          {t.discoveredPagesDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.page}</TableHead>
              <TableHead>{t.forms}</TableHead>
              <TableHead>{t.details}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.url}>
                <TableCell>
                  <div>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">{page.url}</div>
                  </div>
                </TableCell>
                <TableCell>{page.forms.length}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {page.forms.map((form, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getFormTypeColor(form.type)}
                            variant="secondary"
                          >
                            {form.type}
                          </Badge>
                          {form.steps && form.steps > 1 && (
                            <Badge variant="outline">
                              {form.steps} {t.steps}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {form.fields} {t.fields}
                          {form.successPage && (
                            <span className="ml-2">• {t.successPageExists}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
