
export interface DiscoveredPage {
  url: string;
  title: string;
  forms: FormElement[];
}

export interface FormElement {
  id?: string;
  action?: string;
  method?: string;
  fields: number;
  steps?: number;
  classes?: string[];
}

export interface ScanProgress {
  scannedPages: number;
  totalPages: number;
  currentUrl: string;
  estimatedTimeRemaining: string; // Geändert von number zu string
}
