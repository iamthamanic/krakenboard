
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface Visitor {
  id: string;
  page: string;
  timestamp: number;
}

export const RealtimeVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    // Simulierte Echtzeitdaten
    const interval = setInterval(() => {
      const pages = ['/startseite', '/produkte', '/kontakt', '/blog'];
      const newVisitor: Visitor = {
        id: Math.random().toString(36).substring(7),
        page: pages[Math.floor(Math.random() * pages.length)],
        timestamp: Date.now()
      };
      
      setVisitors(current => {
        const newVisitors = [...current, newVisitor]
          .filter(v => Date.now() - v.timestamp < 300000); // Zeige nur Besucher der letzten 5 Minuten
        return newVisitors;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Echtzeit-Besucher</h2>
      </div>
      <div className="space-y-4">
        <div className="text-2xl font-bold">
          {visitors.length} aktive Besucher
        </div>
        <div className="space-y-2">
          {visitors.slice(-5).reverse().map((visitor) => (
            <div key={visitor.id} className="flex justify-between items-center text-sm">
              <span>{visitor.page}</span>
              <span className="text-muted-foreground">
                vor {Math.floor((Date.now() - visitor.timestamp) / 1000)}s
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
