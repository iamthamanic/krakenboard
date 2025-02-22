
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
  inputs?: FormInput[];
  submitButton?: FormButton;
  successPage?: string;
  type: 'standard' | 'dynamic' | 'multi-step';
}

export interface FormInput {
  name: string;
  type: string;
  required: boolean;
  label?: string;
}

export interface FormButton {
  text: string;
  type: 'submit' | 'button';
  classes?: string[];
}

export interface ScanProgress {
  scannedPages: number;
  totalPages: number;
  currentUrl: string;
  estimatedTimeRemaining: string;
}
