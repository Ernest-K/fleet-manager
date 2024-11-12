import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentsUploader from "@/features/documents/components/documents-uploader";
import DocumentList from "@/features/documents/components/document-list";
import queryClient from "@/lib/queryClient";
import { Vehicle } from "@/features/vehicles/types";

type VehicleDocumentsCardProps = {
  vehicleUid: Vehicle["uid"];
};

function VehicleDocumentsCard({ vehicleUid }: VehicleDocumentsCardProps) {
  const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
  const maxSizeMB = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload documents</CardTitle>
        <CardDescription>
          Upload vehicle documents here. Allowed types: {allowedTypes.join(", ")}. Max size: {maxSizeMB} MB
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <DocumentsUploader
          entityType="vehicles"
          allowedTypes={allowedTypes}
          maxSizeMB={maxSizeMB}
          entityUid={vehicleUid}
          onUpload={() => {
            queryClient.invalidateQueries({ queryKey: ["documents", vehicleUid] });
          }}
        />
        <DocumentList entityUid={vehicleUid} />
      </CardContent>
    </Card>
  );
}

export default VehicleDocumentsCard;
