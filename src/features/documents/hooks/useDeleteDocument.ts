import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { EntityDocument } from "../types";
import { deleteObject, ref } from "firebase/storage";

type deleteDocumentOptions = {
  entityDocument: EntityDocument;
};

const deleteDocument = async ({ entityDocument }: deleteDocumentOptions) => {
  await deleteDoc(doc(db, "documents", entityDocument.uid));
  const fileRef = ref(storage, entityDocument.url);
  if (fileRef) {
    await deleteObject(fileRef);
  }
};

type useDeleteDocumentOptions = {
  entityUid: string;
};

export const useDeleteDocument = ({ entityUid }: useDeleteDocumentOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityDocument: deleteDocumentOptions["entityDocument"]) => deleteDocument({ entityDocument }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityUid] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    },
  });
};
