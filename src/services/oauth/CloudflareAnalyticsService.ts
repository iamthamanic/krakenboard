
import { supabase } from "@/integrations/supabase/client";

type TokenDialogConfig = {
  open: (onOpenChange: (open: boolean) => void) => void;
  setOpen: (open: boolean) => void;
};

export class CloudflareAnalyticsService {
  private static tokenDialog: TokenDialogConfig | null = null;

  static registerTokenDialog(dialog: TokenDialogConfig) {
    this.tokenDialog = dialog;
  }

  static async initiateOAuth() {
    try {
      if (!this.tokenDialog) {
        throw new Error('Token Dialog nicht initialisiert');
      }
      
      this.tokenDialog.open((open: boolean) => {
        this.tokenDialog?.setOpen(open);
      });
    } catch (error) {
      console.error('Error initiating Cloudflare OAuth:', error);
      throw error;
    }
  }
}
