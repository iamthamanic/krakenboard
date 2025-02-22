
import { FormElement, FormInput, FormButton } from '../types/scanner.types';

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
    const inputs = this.parseInputs(formHtml);
    const submitButton = this.parseSubmitButton(formHtml);
    const successPage = this.findSuccessPage(formHtml);
    const isMultiStep = this.isMultiStepForm(formHtml);

    return {
      id: (formHtml.match(/id="([^"]*)"/) || [])[1],
      action: (formHtml.match(/action="([^"]*)"/) || [])[1],
      method: (formHtml.match(/method="([^"]*)"/) || [])[1] || 'get',
      fields: inputs.length,
      steps: isMultiStep ? this.countFormSteps(formHtml) : 1,
      classes: ((formHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/),
      inputs,
      submitButton,
      successPage,
      type: isMultiStep ? 'multi-step' : 'standard'
    };
  }

  private static parseDynamicForm(divHtml: string, inputCount: number): FormElement {
    const inputs = this.parseInputs(divHtml);
    const submitButton = this.parseSubmitButton(divHtml);
    
    return {
      fields: inputCount,
      steps: 1,
      classes: ((divHtml.match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/),
      method: 'dynamic',
      inputs,
      submitButton,
      type: 'dynamic'
    };
  }

  private static parseInputs(html: string): FormInput[] {
    const inputs: FormInput[] = [];
    const inputMatches = html.match(/<input[^>]*>|<textarea[^>]*>|<select[^>]*>/g) || [];
    
    inputMatches.forEach(input => {
      const name = (input.match(/name="([^"]*)"/) || [])[1];
      const type = (input.match(/type="([^"]*)"/) || [])[1] || 'text';
      const required = input.includes('required');
      const label = this.findInputLabel(html, name);
      
      if (name && type !== 'submit' && type !== 'button') {
        inputs.push({ name, type, required, label });
      }
    });
    
    return inputs;
  }

  private static parseSubmitButton(html: string): FormButton | undefined {
    const submitMatch = html.match(/<button[^>]*type="submit"[^>]*>([^<]*)<\/button>/) || 
                       html.match(/<input[^>]*type="submit"[^>]*value="([^"]*)"/) ||
                       html.match(/<button[^>]*submit[^>]*>([^<]*)<\/button>/);
    
    if (submitMatch) {
      return {
        text: submitMatch[1] || 'Submit',
        type: 'submit',
        classes: ((submitMatch[0].match(/class="([^"]*)"/) || [])[1] || '').split(/\s+/)
      };
    }
    
    return undefined;
  }

  private static findInputLabel(html: string, inputName: string): string | undefined {
    const labelMatch = html.match(new RegExp(`<label[^>]*for="${inputName}"[^>]*>([^<]*)</label>`));
    return labelMatch ? labelMatch[1].trim() : undefined;
  }

  private static findSuccessPage(html: string): string | undefined {
    const actionMatch = html.match(/action="([^"]*)"/) || [];
    if (actionMatch[1] && actionMatch[1].includes('success')) {
      return actionMatch[1];
    }
    
    const redirectMatch = html.match(/window\.location\.href\s*=\s*['"]([^'"]*success[^'"]*)['"]/);
    return redirectMatch ? redirectMatch[1] : undefined;
  }

  private static isMultiStepForm(html: string): boolean {
    return (
      html.includes('step') ||
      html.includes('wizard') ||
      html.includes('multi-step') ||
      html.includes('formStep')
    );
  }

  private static countFormSteps(html: string): number {
    const stepElements = html.match(/step|wizard|stage/gi) || [];
    return Math.max(stepElements.length, 1);
  }
}
