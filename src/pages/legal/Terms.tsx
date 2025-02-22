
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LegalDocumentEditor } from "@/components/legal/LegalDocumentEditor";
import { useLegalDocument } from "@/hooks/useLegalDocuments";

export const Terms = () => {
  const { document, isLoading, updateDocument } = useLegalDocument('terms');

  return (
    <DashboardLayout>
      <LegalDocumentEditor
        title="Nutzungsbedingungen"
        content={document?.content ?? ''}
        isLoading={isLoading}
        onSave={updateDocument}
      />
    </DashboardLayout>
  );
};
