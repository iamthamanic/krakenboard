
import { FormElement } from '../types/scanner.types';

export class FormParser {
  static parseFromHtml(html: string): FormElement[] {
    const forms: FormElement[] = [];
    
    // Parse standard forms
    const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/g) || [];
    formMatches.forEach(formHtml => {
      forms.push(this.parseFormElement(formHtml));
    });
    
    // Parse dynamic forms
    const divFormMatches = html.match(/<div[^>]*form[^>]*>[\s\S]*?<\/div>/g) || [];
    divFormMatches.forEach(divHtml => {
      const inputCount = (divHtml.match(/<input[^>]*>/g) || []).length;
      if (inputCount > 0) {
        forms.push(this.parseDynamicForm(divHtml, inputCount));
      }
    });
    
    return forms;
  }

  private static parseFormElement(formHtml: string): FormElement {
    return {
      id: (formHtml.match(/id="([^"]*)"/) || [])[1],
      action: (formHtml.match(/action="([^"]*)"/) || [])[1],
      method: (formHtml.match(/method="([^"]*)"/) || [])[1] || 'get',
      fields: (formHtml.match(/<input[^>]*>/g) || []).length,
      steps: (formHtml.match(/step|wizard|multi|stage/gi) || []).length || 1,
      classes: ((formHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/)
    };
  }

  private static parseDynamicForm(divHtml: string, inputCount: number): FormElement {
    return {
      fields: inputCount,
      steps: (divHtml.match(/step|wizard|multi|stage/gi) || []).length || 1,
      classes: ((divHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/),
      method: 'dynamic'
    };
  }
}
