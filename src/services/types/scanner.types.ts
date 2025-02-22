
export interface DiscoveredPage {
  id?: string;
  url: string;
  title?: string;
  forms: FormElement[];
  lastSeenAt?: Date;
}

export interface FormElement {
  id?: string;
  type: 'standard' | 'dynamic' | 'multi-step';
  fields: number;
  successPage?: string;
  isMultiStep: boolean;
  stepsCount?: number;
  action?: string;
  method?: string;
  inputs?: FormInput[];
  submitButton?: FormButton;
  lastSeenAt?: Date;
}

export interface FormInput {
  name: string;
  type: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export interface FormButton {
  text: string;
  type: string;
  classes?: string[];
}

export interface WebsiteScanResult {
  id: string;
  url: string;
  lastScanAt: string;
  pages: DiscoveredPage[];
}

export interface ScanProgress {
  scannedPages: number;
  totalPages: number;
  currentUrl: string;
  estimatedTimeRemaining: string;
}
