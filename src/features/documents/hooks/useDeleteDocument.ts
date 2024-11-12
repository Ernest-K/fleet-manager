import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import { EntityDocument } from "@/features/documents/types";
import { deleteObject, ref } from "firebase/storage";
import queryClient from "@/lib/queryClient";
import { CollectionNames } from "@/types";

type deleteDocumentOptions = {
  entityDocument: EntityDocument;
};

const deleteDocument = async ({ entityDocument }: deleteDocumentOptions) => {
  await deleteDoc(doc(db, CollectionNames.Documents, entityDocument.uid));
  const fileRef = ref(storage, entityDocument.url);
  if (fileRef) {
    await deleteObject(fileRef);
  }
};

type useDeleteDocumentOptions = {
  entityUid: string;
};

export const useDeleteDocument = ({ entityUid }: useDeleteDocumentOptions) => {
  return useMutation({
    mutationFn: (entityDocument: deleteDocumentOptions["entityDocument"]) => deleteDocument({ entityDocument }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityUid] });
    },
  });
};
