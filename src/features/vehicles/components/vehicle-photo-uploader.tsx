import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useUploadVehiclePhoto } from "../hooks/useUploadVehiclePhoto";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { useDeletePhoto } from "@/features/vehicles/hooks/useDeleteVehiclePhoto";
import Image from "next/image";

type VehiclePhotoUploaderProps = {
  vehicleUid: string;
  photosURL?: string[];
  onUpload?: () => void;
};

function VehiclePhotoUploader({ vehicleUid, photosURL, onUpload }: VehiclePhotoUploaderProps) {
  const { uploadImages, uploading } = useUploadVehiclePhoto({ vehicleUid });
  const { mutate: deletePhoto } = useDeletePhoto({ vehicleUid });
  const [deletingPhotoURL, setDeletingPhotoURL] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      uploadImages({
        photos: files,
        onSuccess: () => {
          toast({
            description: "Photo uploaded successfully",
          });
          onUpload && onUpload();
        },
      });
    }
  };

  const handleDeletePhoto = (photoURL: string) => {
    setDeletingPhotoURL(photoURL);
    deletePhoto(photoURL, {
      onSuccess: () => {
        toast({
          description: "Photo deleted successfully",
        });
        setDeletingPhotoURL(null);
      },
      onError: () => {
        setDeletingPhotoURL(null);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload photos</CardTitle>
        <CardDescription>Upload vehicle photos here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {photosURL &&
            photosURL.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image src={url} alt={`Uploaded photo ${index + 1}`} width={500} height={500} className="w-full h-full object-cover rounded-md" />
                <button className="absolute top-1 right-1 bg-white rounded-full p-1" aria-label={`Remove image ${index + 1}`} disabled={deletingPhotoURL === url} onClick={() => handleDeletePhoto(url)}>
                  {deletingPhotoURL === url ? <Icons.spinner className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 text-gray-600" />}
                </button>
              </div>
            ))}
          <div className="flex justify-center aspect-square">
            <Button variant="outline" className="flex items-center grow h-full" onClick={() => document.getElementById("file-upload")?.click()}>
              {uploading ? <Icons.spinner className="text-muted-foreground w-8 h-8 sm:w-12 sm:h-12 animate-spin" /> : <Plus className="text-muted-foreground w-8 h-8 sm:w-12 sm:h-12" />}
            </Button>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default VehiclePhotoUploader;
