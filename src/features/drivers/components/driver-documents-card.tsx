import React from "react";
import { Driver } from "@/features/drivers/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentsUploader from "../../documents/components/documents-uploader";
import { useQueryClient } from "@tanstack/react-query";
import DocumentList from "@/features/documents/components/document-list";

type DriverDocumentsCardProps = {
  driverUid: Driver["uid"];
};

function DriverDocumentsCard({ driverUid }: DriverDocumentsCardProps) {
  const queryClient = useQueryClient();
  const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
  const maxSizeMB = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload documents</CardTitle>
        <CardDescription>
          Upload your documents here. Allowed types: {allowedTypes.join(", ")}. Max size: {maxSizeMB} MB
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <DocumentsUploader
          entityType="users"
          allowedTypes={allowedTypes}
          maxSizeMB={maxSizeMB}
          entityUid={driverUid}
          onUpload={() => {
            queryClient.invalidateQueries({ queryKey: ["documents", driverUid] });
          }}
        />
        <DocumentList entityUid={driverUid} />
      </CardContent>
    </Card>
  );
}

export default DriverDocumentsCard;
