
interface FormField {
  type: string;
  name: string;
  id?: string;
  required: boolean;
  label?: string;
}

interface ParsedForm {
  action: string;
  method: string;
  fields: FormField[];
  submitButton?: {
    text: string;
    type: string;
  };
}

export class FormParser {
  static parseFromHtml(html: string, baseUrl: string): ParsedForm[] {
    const forms: ParsedForm[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const formElements = doc.getElementsByTagName('form');

    for (const form of Array.from(formElements)) {
      const parsedForm: ParsedForm = {
        action: this.resolveActionUrl(form.getAttribute('action') || '', baseUrl),
        method: (form.getAttribute('method') || 'get').toLowerCase(),
        fields: this.parseFormFields(form),
      };

      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        parsedForm.submitButton = {
          text: submitButton.textContent || submitButton.getAttribute('value') || 'Submit',
          type: submitButton.tagName.toLowerCase()
        };
      }

      forms.push(parsedForm);
    }

    return forms;
  }

  private static parseFormFields(form: HTMLFormElement): FormField[] {
    const fields: FormField[] = [];
    const inputs = form.querySelectorAll('input, select, textarea');

    for (const input of Array.from(inputs)) {
      const type = input.getAttribute('type') || input.tagName.toLowerCase();
      if (type === 'submit' || type === 'button') continue;

      const field: FormField = {
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

  private static resolveActionUrl(action: string, baseUrl: string): string {
    if (!action || action === '#') return baseUrl;
    if (action.startsWith('http')) return action;
    if (action.startsWith('/')) return `${new URL(baseUrl).origin}${action}`;
    return `${baseUrl}${action.startsWith('/') ? '' : '/'}${action}`;
  }

  static async detectThankYouPage(form: ParsedForm, baseUrl: string): Promise<string | null> {
    try {
      if (form.method.toLowerCase() !== 'get') return null;
      
      const testData: Record<string, string> = {};
      form.fields.forEach(field => {
        testData[field.name] = 'test';
      });

      const searchParams = new URLSearchParams(testData);
      const testUrl = `${form.action}?${searchParams.toString()}`;
      
      const response = await fetch(testUrl);
      const html = await response.text();
      
      // Suche nach typischen "Danke"-Phrasen
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
