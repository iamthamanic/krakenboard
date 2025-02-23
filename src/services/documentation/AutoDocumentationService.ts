
import { supabase } from "@/integrations/supabase/client";

export class AutoDocumentationService {
  static async documentFeature(
    category: string,
    title: string,
    featureName: string,
    description: string,
    implemented: boolean = true
  ) {
    try {
      console.log(`Documenting feature: ${featureName} in category ${category}`);
      
      // Hole aktuelle Dokumentation
      const { data: existingDoc } = await supabase
        .from('tech_documentation')
        .select('*')
        .eq('category', category)
        .eq('title', title)
        .single();

      // Bereite neue Feature-Dokumentation vor
      const newFeature = {
        name: featureName,
        implemented,
        description
      };

      let updatedContent;
      
      if (existingDoc) {
        // Update existierende Dokumentation
        const content = existingDoc.content;
        const categoryItems = content[category] || [];
        
        // Prüfe ob Feature bereits existiert
        const existingFeatureIndex = categoryItems.findIndex(
          (item: any) => typeof item === 'object' && item.name === featureName
        );

        if (existingFeatureIndex >= 0) {
          categoryItems[existingFeatureIndex] = newFeature;
        } else {
          categoryItems.push(newFeature);
        }

        updatedContent = {
          ...content,
          [category]: categoryItems
        };
      } else {
        // Erstelle neue Dokumentation
        updatedContent = {
          [category]: [newFeature]
        };
      }

      // Speichere aktualisierte Dokumentation
      const { error } = await supabase.rpc('update_tech_documentation', {
        p_category: category,
        p_title: title,
        p_content: updatedContent
      });

      if (error) throw error;
      
      console.log(`Successfully documented feature: ${featureName}`);
    } catch (error) {
      console.error('Error documenting feature:', error);
      throw error;
    }
  }

  static async updateImplementationStatus(
    category: string,
    title: string,
    featureName: string,
    implemented: boolean
  ) {
    return this.documentFeature(
      category,
      title,
      featureName,
      'Status updated automatically',
      implemented
    );
  }
}

