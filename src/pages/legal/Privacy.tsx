
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LegalDocumentEditor } from "@/components/legal/LegalDocumentEditor";
import { useLegalDocument } from "@/hooks/useLegalDocuments";

export const Privacy = () => {
  const { document, isLoading, updateDocument } = useLegalDocument('privacy');

  return (
    <DashboardLayout>
      <LegalDocumentEditor
        title="Datenschutzerklärung"
        content={document?.content ?? ''}
        isLoading={isLoading}
        onSave={updateDocument}
      />
    </DashboardLayout>
  );
};
