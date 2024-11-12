import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import { useUploadDocument } from "@/features/documents/hooks/useUploadDocument";
import { toast } from "@/components/ui/use-toast";

type DocumentsUploaderProps = {
  entityType: "users" | "vehicles";
  entityUid: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onUpload?: () => void;
};

const DocumentsUploader = ({ entityType, entityUid, maxSizeMB = 5, allowedTypes = [".pdf", ".doc", ".docx", ".txt"], onUpload }: DocumentsUploaderProps) => {
  const [file, setFile] = useState<File | null>();
  const [fileError, setFileError] = useState<string | null>(null);
  const [label, setLabel] = useState<string>();
  const { uploadDocument, uploading, error, progress } = useUploadDocument({ entityType });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileError(null);

      const fileType = `.${selectedFile.name.split(".").pop()}`;
      if (!allowedTypes.includes(fileType.toLowerCase())) {
        setFileError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
        return;
      }

      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setFileError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      setFile(selectedFile);
      setLabel(selectedFile.name);
    }
  };

  const handleUpload = () => {
    if (!file || !label) return;

    uploadDocument({
      entityUid,
      label,
      file,
      onSuccess: () => {
        setFile(null);
        setLabel("");
        toast({
          description: "Document uploaded successfully",
        });
        onUpload && onUpload();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: error.message,
        });
      },
    });
  };

  return (
    <>
      <div className="flex flex-row gap-3 flex-wrap">
        <Input id="document-upload" type="file" accept={allowedTypes.join(", ")} onChange={handleFileChange} className="basis-80 grow" />
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Document label" className="basis-80 grow" />
        <LoadingButton
          label="Upload"
          loadingLabel="Uploading"
          isLoading={uploading}
          onClick={handleUpload}
          disabled={uploading || !file || !label}
          className="grow sm:grow-0"
        />
      </div>
      {fileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DocumentsUploader;
