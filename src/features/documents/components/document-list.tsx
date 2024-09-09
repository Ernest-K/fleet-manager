import React, { useState } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useGetDocuments } from "@/features/documents/hooks/useGetDocuments";
import { useDeleteDocument } from "@/features/documents/hooks/useDeleteDocument";
import Link from "next/link";
import { EntityDocument } from "@/features/documents/types";
import { Icons } from "../../../components/ui/icons";
import { toast } from "../../../components/ui/use-toast";

type DocumentListProps = {
  entityUid: string;
};

function DocumentList({ entityUid }: DocumentListProps) {
  const { data: documents, isLoading } = useGetDocuments({ entityUid });
  const { mutate: deleteDocument } = useDeleteDocument({ entityUid });
  const [deletingDocumentUid, setDeletingDocumentUid] = useState<string | null>(null);

  const handleDeleteDocument = (entityDocument: EntityDocument) => {
    setDeletingDocumentUid(entityDocument.uid);
    deleteDocument(entityDocument, {
      onSuccess: () => {
        toast({
          description: "Document deleted successfully",
        });
        setDeletingDocumentUid(null);
      },
      onError: () => {
        setDeletingDocumentUid(null);
      },
    });
  };

  return documents?.length ? (
    <ul className="space-y-2">
      {documents.map((document) => (
        <li className="flex gap-4 items-center justify-start p-3 bg-muted rounded-md" key={document.uid}>
          <FileText className="h-5 w-5" />
          <div>
            <Link href={document.url} target="_blank">
              {document.label}
            </Link>
            <p className="text-xs text-muted-foreground">{document.fileName}</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div>
              <p className="hidden sm:block text-sm text-muted-foreground text-right">{new Date(document.createdAt.seconds * 1000).toUTCString()}</p>
              <p className="text-xs text-muted-foreground text-right">{(document.fileSize / 1024).toFixed(2)} KB</p>
            </div>
            <Button size="icon" variant="secondary" className="h-6 w-6" onClick={() => handleDeleteDocument(document)} disabled={deletingDocumentUid === document.uid}>
              {deletingDocumentUid === document.uid ? <Icons.spinner className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-muted-foreground">No documents uploaded yet.</p>
  );
}

export default DocumentList;
