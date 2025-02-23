
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CloudflareTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CloudflareTokenDialog({ open, onOpenChange }: CloudflareTokenDialogProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validiere das Token durch einen Test-API-Call
      const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Ungültiges API-Token');
      }

      // Speichere das Token in der Datenbank
      const { error } = await supabase
        .from('integrations')
        .insert({
          type: "cloudflare" as const,
          credentials: { token },
          is_active: true,
          integration_type: "cloudflare",
        });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Cloudflare wurde erfolgreich verbunden",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving Cloudflare token:', error);
      toast({
        title: "Fehler",
        description: "Ungültiges API-Token oder Verbindungsfehler",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Cloudflare API-Token</DialogTitle>
            <DialogDescription>
              Gib dein Cloudflare API-Token ein, um die Analytics-Daten abzurufen.
              Das Token findest du in deinem Cloudflare Dashboard unter "API Tokens".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="cf-token-xxx..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!token || isLoading}
            >
              {isLoading ? "Verbinde..." : "Verbinden"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
