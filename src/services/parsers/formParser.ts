
import { FormElement, FormInput, FormButton } from '../types/scanner.types';

export class FormParser {
  static parseFromHtml(html: string, url: string): FormElement[] {
    const forms: FormElement[] = [];
    
    // Parse standard forms
    const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/g) || [];
    formMatches.forEach(formHtml => {
      forms.push(this.parseFormElement(formHtml, url));
    });
    
    // Parse dynamic forms
    const divFormMatches = html.match(/<div[^>]*form[^>]*>[\s\S]*?<\/div>/g) || [];
    divFormMatches.forEach(divHtml => {
      const inputCount = (divHtml.match(/<input[^>]*>/g) || []).length;
      if (inputCount > 0) {
        forms.push(this.parseDynamicForm(divHtml, url, inputCount));
      }
    });
    
    return forms;
  }

  private static parseFormElement(formHtml: string, baseUrl: string): FormElement {
    const inputs = this.parseInputs(formHtml);
    const submitButton = this.parseSubmitButton(formHtml);
    const successPage = this.findSuccessPage(formHtml, baseUrl);
    const isMultiStep = this.isMultiStepForm(formHtml);
    const stepsCount = isMultiStep ? this.countFormSteps(formHtml) : 1;
    const formId = this.extractFormId(formHtml);
    const formType = this.determineFormType(formHtml);
    const action = this.normalizeActionUrl(formHtml, baseUrl);

    return {
      id: formId,
      type: formType,
      fields: inputs.length,
      successPage,
      isMultiStep,
      stepsCount,
      action,
      method: (formHtml.match(/method="([^"]*)"/) || [])[1]?.toLowerCase() || 'get',
      inputs,
      submitButton,
      lastSeenAt: new Date()
    };
  }

  private static parseDynamicForm(divHtml: string, baseUrl: string, inputCount: number): FormElement {
    const inputs = this.parseInputs(divHtml);
    const submitButton = this.parseSubmitButton(divHtml);
    const formId = this.extractFormId(divHtml);
    const action = this.findDynamicFormAction(divHtml, baseUrl);
    
    return {
      id: formId,
      type: 'dynamic',
      fields: inputCount,
      isMultiStep: false,
      stepsCount: 1,
      action,
      inputs,
      submitButton,
      lastSeenAt: new Date()
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
      const placeholder = (input.match(/placeholder="([^"]*)"/) || [])[1];
      
      if (name && type !== 'submit' && type !== 'button') {
        inputs.push({ 
          name, 
          type, 
          required, 
          label,
          placeholder 
        });
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
    if (!inputName) return undefined;
    
    // Suche nach expliziten Label-Tags
    const labelMatch = html.match(new RegExp(`<label[^>]*for="${inputName}"[^>]*>([^<]*)</label>`));
    if (labelMatch) return labelMatch[1].trim();
    
    // Suche nach Labels innerhalb von div-Containern
    const divMatch = html.match(new RegExp(`<div[^>]*>\\s*<label[^>]*>${inputName}</label>\\s*<input[^>]*name="${inputName}"`, 'i'));
    if (divMatch) return inputName;
    
    return undefined;
  }

  private static findSuccessPage(html: string, baseUrl: string): string | undefined {
    // Suche nach expliziten Erfolgsseiten-URLs
    const successPatterns = [
      /data-success-url="([^"]*)"/, 
      /data-redirect="([^"]*)"/, 
      /success-page="([^"]*)"/,
      /thank-you-page="([^"]*)"/
    ];
    
    for (const pattern of successPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return this.normalizeUrl(match[1], baseUrl);
      }
    }
    
    // Suche nach JavaScript-Redirects
    const jsMatch = html.match(/window\.location\.href\s*=\s*['"]([^'"]*success[^'"]*)['"]/);
    if (jsMatch) {
      return this.normalizeUrl(jsMatch[1], baseUrl);
    }
    
    // Suche nach action URLs mit Erfolgsseiten-Hinweisen
    const actionMatch = html.match(/action="([^"]*)"/) || [];
    if (actionMatch[1] && this.looksLikeSuccessPage(actionMatch[1])) {
      return this.normalizeUrl(actionMatch[1], baseUrl);
    }
    
    return undefined;
  }

  private static looksLikeSuccessPage(url: string): boolean {
    const successKeywords = ['success', 'thank-you', 'thankyou', 'thanks', 'confirmation', 'confirmed'];
    return successKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private static isMultiStepForm(html: string): boolean {
    const multiStepIndicators = [
      'step',
      'wizard',
      'multi-step',
      'formStep',
      'data-step',
      'step-indicator'
    ];
    
    return multiStepIndicators.some(indicator => html.toLowerCase().includes(indicator));
  }

  private static countFormSteps(html: string): number {
    const stepElements = html.match(/step|wizard|stage/gi) || [];
    const explicitSteps = html.match(/data-steps="(\d+)"/) || [];
    
    if (explicitSteps[1]) {
      return parseInt(explicitSteps[1], 10);
    }
    
    return Math.max(stepElements.length, 1);
  }

  private static extractFormId(html: string): string {
    const idMatch = html.match(/id="([^"]*)"/) || [];
    return idMatch[1] || crypto.randomUUID();
  }

  private static determineFormType(html: string): 'standard' | 'dynamic' | 'multi-step' {
    if (this.isMultiStepForm(html)) return 'multi-step';
    if (html.includes('<form')) return 'standard';
    return 'dynamic';
  }

  private static normalizeActionUrl(formHtml: string, baseUrl: string): string | undefined {
    const actionMatch = formHtml.match(/action="([^"]*)"/) || [];
    if (!actionMatch[1]) return undefined;
    
    return this.normalizeUrl(actionMatch[1], baseUrl);
  }

  private static findDynamicFormAction(html: string, baseUrl: string): string | undefined {
    const actionMatch = html.match(/data-action="([^"]*)"/) || 
                       html.match(/data-url="([^"]*)"/) ||
                       html.match(/data-endpoint="([^"]*)"/);
    
    if (actionMatch && actionMatch[1]) {
      return this.normalizeUrl(actionMatch[1], baseUrl);
    }
    
    return undefined;
  }

  private static normalizeUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return new URL(url, baseUrl).toString();
    return new URL(url, baseUrl).toString();
  }
}
