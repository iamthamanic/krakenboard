
import { AutoDocumentationService } from "@/services/documentation/AutoDocumentationService";

// Beispiel für die Dokumentation einer neuen Funktion
const documentNewFeature = async () => {
  await AutoDocumentationService.documentFeature(
    'website',
    'Website Features',
    'Neues Feature',
    'Beschreibung des neuen Features',
    true
  );
};

// Beispiel für die Aktualisierung des Implementierungsstatus
const updateFeatureStatus = async () => {
  await AutoDocumentationService.updateImplementationStatus(
    'website',
    'Website Features',
    'Existierendes Feature',
    true
  );
};
