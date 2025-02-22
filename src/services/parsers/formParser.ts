
import { FormElement, FormInput } from '@/services/types/scanner.types';

interface ParsedFormField {
  type: string;
  name: string;
  id?: string;
  required: boolean;
  label?: string;
}

interface ParsedForm {
  action: string;
  method: string;
  fields: ParsedFormField[];
  submitButton?: {
    text: string;
    type: string;
  };
}

export class FormParser {
  static parseFromHtml(html: string, baseUrl: string): FormElement[] {
    const forms: FormElement[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const formElements = doc.getElementsByTagName('form');

    for (const form of Array.from(formElements)) {
      const parsedForm = this.parseForm(form, baseUrl);
      forms.push(this.convertToFormElement(parsedForm, form));
    }

    return forms;
  }

  private static parseForm(form: HTMLFormElement, baseUrl: string): ParsedForm {
    return {
      action: this.resolveActionUrl(form.getAttribute('action') || '', baseUrl),
      method: (form.getAttribute('method') || 'get').toLowerCase(),
      fields: this.parseFormFields(form),
      submitButton: this.parseSubmitButton(form)
    };
  }

  private static parseFormFields(form: HTMLFormElement): ParsedFormField[] {
    const fields: ParsedFormField[] = [];
    const inputs = form.querySelectorAll('input, select, textarea');

    for (const input of Array.from(inputs)) {
      const type = input.getAttribute('type') || input.tagName.toLowerCase();
      if (type === 'submit' || type === 'button') continue;

      const field: ParsedFormField = {
        type: type,
        name: input.getAttribute('name') || '',
        required: input.hasAttribute('required'),
      };

      if (input.id) {
        field.id = input.id;
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label) {
          field.label = label.textContent?.trim();
        }
      }

      fields.push(field);
    }

    return fields;
  }

  private static parseSubmitButton(form: HTMLFormElement) {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      return {
        text: submitButton.textContent || submitButton.getAttribute('value') || 'Submit',
        type: submitButton.tagName.toLowerCase()
      };
    }
    return undefined;
  }

  private static resolveActionUrl(action: string, baseUrl: string): string {
    if (!action || action === '#') return baseUrl;
    if (action.startsWith('http')) return action;
    if (action.startsWith('/')) return `${new URL(baseUrl).origin}${action}`;
    return `${baseUrl}${action.startsWith('/') ? '' : '/'}${action}`;
  }

  private static convertToFormElement(parsedForm: ParsedForm, originalForm: HTMLFormElement): FormElement {
    // Generiere eine eindeutige ID basierend auf der Action-URL und einem Zeitstempel
    const id = `form_${btoa(parsedForm.action).replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
    
    // Extrahiere einen sinnvollen Namen aus dem Formular
    const formName = this.extractFormName(originalForm) || `Form auf ${new URL(parsedForm.action).pathname}`;

    const formElement: FormElement = {
      id,
      name: formName,
      type: 'standard',
      fields: parsedForm.fields.length,
      isMultiStep: false,
      action: parsedForm.action,
      method: parsedForm.method,
      inputs: parsedForm.fields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required,
        label: field.label
      })),
      submitButton: parsedForm.submitButton ? {
        text: parsedForm.submitButton.text,
        type: parsedForm.submitButton.type,
        classes: []
      } : undefined
    };

    return formElement;
  }

  private static extractFormName(form: HTMLFormElement): string {
    // Versuche einen Namen aus verschiedenen Quellen zu extrahieren
    const sources = [
      form.getAttribute('name'),
      form.getAttribute('id'),
      form.getAttribute('aria-label'),
      form.querySelector('legend')?.textContent,
      form.querySelector('h1,h2,h3,h4,h5,h6')?.textContent,
      form.querySelector('label')?.textContent
    ];

    // Nimm den ersten nicht-leeren Wert
    const name = sources.find(source => source && source.trim());
    return name?.trim() || 'Unbenanntes Formular';
  }

  static async detectThankYouPage(form: FormElement, baseUrl: string): Promise<string | null> {
    try {
      if (form.method?.toLowerCase() !== 'get') return null;
      
      const testData: Record<string, string> = {};
      form.inputs?.forEach(field => {
        testData[field.name] = 'test';
      });

      const searchParams = new URLSearchParams(testData);
      const testUrl = `${form.action}?${searchParams.toString()}`;
      
      const response = await fetch(testUrl);
      const html = await response.text();
      
      const thanksPatterns = [
        /danke/i,
        /thank\s*you/i,
        /erfolgreich/i,
        /success/i,
        /bestätigung/i,
        /confirmation/i
      ];

      if (thanksPatterns.some(pattern => pattern.test(html))) {
        return testUrl;
      }

      return null;
    } catch (error) {
      console.error('Error detecting thank you page:', error);
      return null;
    }
  }
}
