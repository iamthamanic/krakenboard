
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
}

export interface FormConversion {
  id?: string;
  formId: string;
  timestamp: Date;
  isSuccessful: boolean;
  errorMessage?: string;
}

export interface WebsiteScanResult {
  url: string;
  pages: DiscoveredPage[];
  lastScanAt: Date;
}
