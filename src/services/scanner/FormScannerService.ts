
import { supabase } from "@/integrations/supabase/client";

export interface FormField {
  name: string;
  type: string;
  required: boolean;
  label?: string;
}

export interface ScannedForm {
  action?: string;
  method?: string;
  fields: FormField[];
  selector: string;
  submitButton?: {
    text?: string;
    type: string;
  };
}

type JsonFormField = {
  [key: string]: string | boolean | undefined;
}

export class FormScannerService {
  private websiteId: string;
  private url: string;

  constructor(websiteId: string, url: string) {
    this.websiteId = websiteId;
    this.url = url;
  }

  async scanForms(): Promise<void> {
    try {
      // Simuliere das Scannen der Website
      const forms = await this.fetchFormsFromWebsite();
      
      // Speichere die gefundenen Formulare in der Datenbank
      await this.saveForms(forms);
      
      // Aktualisiere den last_scan_at Timestamp der Website
      await this.updateWebsiteLastScan();
    } catch (error) {
      console.error('Fehler beim Scannen der Formulare:', error);
      throw error;
    }
  }

  private async fetchFormsFromWebsite(): Promise<ScannedForm[]> {
    // TODO: Implementiere tatsächliches Webscraping
    // Fürs erste simulieren wir gefundene Formulare
    return [
      {
        action: "/api/contact",
        method: "POST",
        selector: "#contact-form",
        fields: [
          {
            name: "email",
            type: "email",
            required: true,
            label: "E-Mail Adresse"
          },
          {
            name: "message",
            type: "textarea",
            required: true,
            label: "Nachricht"
          }
        ],
        submitButton: {
          text: "Absenden",
          type: "submit"
        }
      }
    ];
  }

  private async saveForms(forms: ScannedForm[]): Promise<void> {
    for (const form of forms) {
      const { data: existingForm } = await supabase
        .from('forms')
        .select('id')
        .eq('website_id', this.websiteId)
        .eq('selector', form.selector)
        .maybeSingle();

      // Konvertiere FormField[] zu JsonFormField[]
      const jsonFields: JsonFormField[] = form.fields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required,
        label: field.label
      }));

      if (existingForm) {
        await supabase
          .from('forms')
          .update({
            action: form.action,
            method: form.method,
            form_inputs: jsonFields,
            submit_button: form.submitButton,
            fields_count: form.fields.length,
            last_seen_at: new Date().toISOString()
          })
          .eq('id', existingForm.id);
      } else {
        await supabase
          .from('forms')
          .insert({
            website_id: this.websiteId,
            selector: form.selector,
            action: form.action,
            method: form.method,
            form_inputs: jsonFields,
            submit_button: form.submitButton,
            fields_count: form.fields.length,
            form_type: 'contact', // Später dynamisch bestimmen
            status: 'active'
          });
      }
    }
  }

  private async updateWebsiteLastScan(): Promise<void> {
    await supabase
      .from('websites')
      .update({ last_scan_at: new Date().toISOString() })
      .eq('id', this.websiteId);
  }
}
