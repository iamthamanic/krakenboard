
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LegalDocumentEditorProps {
  title: string;
  content: string;
  isLoading: boolean;
  onSave: (content: string) => Promise<void>;
}

export const LegalDocumentEditor = ({
  title,
  content,
  isLoading,
  onSave
}: LegalDocumentEditorProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedContent);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[500px] font-mono"
        />
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Speichert..." : "Speichern"}
        </Button>
      </CardContent>
    </Card>
  );
};
